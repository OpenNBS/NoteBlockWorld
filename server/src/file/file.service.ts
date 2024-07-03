import * as path from 'path';

import {
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  s3Client: S3Client;
  region: string;
  bucketSongs: string;
  bucketThumbs: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = this.getS3Client();

    const bucketSongs = this.configService.get<string>('S3_BUCKET_SONGS');
    const bucketThumbs = this.configService.get<string>('S3_BUCKET_THUMBS');

    if (!(bucketSongs && bucketThumbs)) {
      throw new Error('Missing S3 bucket configuration');
    }

    this.bucketSongs = bucketSongs;
    this.bucketThumbs = bucketThumbs;
  }

  private getS3Client() {
    // Load environment variables
    const key = this.configService.get<string>('S3_KEY');
    const secret = this.configService.get<string>('S3_SECRET');
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const region = this.configService.get<string>('S3_REGION');

    if (!(key && secret && endpoint && region)) {
      throw new Error('Missing S3 configuration');
    }

    this.region = region;

    // Create S3 client
    const s3Config = new S3Client({
      region: region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: key,
        secretAccessKey: secret,
      },
    });

    return s3Config;
  }

  // Uploads a song to the S3 bucket and returns the key
  public async uploadSong(buffer: Buffer, publicId: string) {
    const bucket = this.bucketSongs;

    const fileName =
      'songs/' + path.parse(publicId).name.replace(/\s/g, '') + '.nbs';

    const mimetype = 'application/octet-stream';

    await this.s3_upload(
      buffer,
      bucket,
      fileName,
      mimetype,
      ObjectCannedACL.private,
    );

    return fileName;
  }

  public async uploadPackedSong(buffer: Buffer, publicId: string) {
    const bucket = this.bucketSongs;

    const fileName =
      'packed/' + path.parse(publicId).name.replace(/\s/g, '') + '.nbs';

    const mimetype = 'application/zip';

    await this.s3_upload(
      buffer,
      bucket,
      fileName,
      mimetype,
      ObjectCannedACL.private,
    );

    return fileName;
  }

  public async getSongDownloadUrl(key: string, filename: string) {
    const bucket = this.bucketSongs;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename=${filename
        .split('/')
        .pop()}`,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 2 * 60, // 2 minutes
    });

    return signedUrl;
  }

  public async uploadThumbnail(buffer: Buffer, publicId: string) {
    const bucket = this.bucketThumbs;

    const fileName =
      'thumbs/' + path.parse(publicId).name.replace(/\s/g, '') + '.jpg';

    const mimetype = 'image/jpeg';

    await this.s3_upload(
      buffer,
      bucket,
      fileName,
      mimetype,
      ObjectCannedACL.public_read,
    );

    return this.getThumbnailUrl(fileName);
  }

  public getThumbnailUrl(key: string) {
    const bucket = this.bucketThumbs;
    const url = this.getPublicFileUrl(key, bucket);
    return url;
  }

  private getPublicFileUrl(key: string, bucket: string) {
    const region = this.region;
    return `https://${bucket}.s3.${region}.backblazeb2.com/${key}`;
  }

  public async deleteSong(nbsFileUrl: string) {
    const bucket = this.bucketSongs;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: nbsFileUrl,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file: ', error);
      throw error;
    }

    return;
  }

  async s3_upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
    accessControl: ObjectCannedACL = ObjectCannedACL.public_read,
  ) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: accessControl,
      ContentType: mimetype,
      ContentDisposition: `attachment; filename=${name.split('/').pop()}`,
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    const command = new PutObjectCommand(params);

    try {
      const s3Response = await this.s3Client.send(command);
      return s3Response;
    } catch (error) {
      console.error('Error uploading file: ', error);
      throw error;
    }
  }

  public async getSongFile(nbsFileUrl: string): Promise<ArrayBuffer> {
    const bucket = this.bucketSongs;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: nbsFileUrl,
    });

    try {
      const response = await this.s3Client.send(command);
      const byteArray = await response.Body?.transformToByteArray();

      if (!byteArray) {
        throw new Error('Error getting file');
      }

      return byteArray.buffer;
    } catch (error) {
      console.error('Error getting file: ', error);
      throw error;
    }
  }
}
