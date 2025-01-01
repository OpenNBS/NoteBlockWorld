import * as path from 'path';

import {
  GetObjectCommand,
  HeadBucketCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private s3Client: S3Client;
  private region: string;

  constructor(
    @Inject('S3_BUCKET_SONGS')
    private readonly S3_BUCKET_SONGS: string,
    @Inject('S3_BUCKET_THUMBS')
    private readonly S3_BUCKET_THUMBS: string,

    @Inject('S3_KEY')
    private readonly S3_KEY: string,
    @Inject('S3_SECRET')
    private readonly S3_SECRET: string,
    @Inject('S3_ENDPOINT')
    private readonly S3_ENDPOINT: string,
    @Inject('S3_REGION')
    private readonly S3_REGION: string,
  ) {
    this.s3Client = this.getS3Client();
    // verify that the bucket exists

    this.verifyBucket();
  }

  private async verifyBucket() {
    try {
      this.logger.debug(
        `Verifying buckets ${this.S3_BUCKET_SONGS} and ${this.S3_BUCKET_THUMBS}`,
      );

      await Promise.all([
        this.s3Client.send(
          new HeadBucketCommand({ Bucket: this.S3_BUCKET_SONGS }),
        ),
        this.s3Client.send(
          new HeadBucketCommand({ Bucket: this.S3_BUCKET_THUMBS }),
        ),
      ]);

      this.logger.debug('Buckets verification successful');
    } catch (error) {
      this.logger.error(
        `Error verifying buckets ${this.S3_BUCKET_SONGS} and ${this.S3_BUCKET_THUMBS}`,
        error,
      );

      throw error;
    }
  }

  private getS3Client() {
    // Load environment variables
    const key = this.S3_KEY;
    const secret = this.S3_SECRET;
    const endpoint = this.S3_ENDPOINT;
    const region = this.S3_REGION;

    this.region = region;

    // Create S3 client
    const s3Config = new S3Client({
      region: region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: key,
        secretAccessKey: secret,
      },
      forcePathStyle: endpoint.includes('localhost') ? true : false,
    });

    return s3Config;
  }

  // Uploads a song to the S3 bucket and returns the key
  public async uploadSong(buffer: Buffer, publicId: string) {
    const bucket = this.S3_BUCKET_SONGS;

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
    const bucket = this.S3_BUCKET_SONGS;

    const fileName =
      'packed/' + path.parse(publicId).name.replace(/\s/g, '') + '.zip';

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
    const bucket = this.S3_BUCKET_SONGS;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 2 * 60, // 2 minutes
    });

    return signedUrl;
  }

  public async uploadThumbnail(buffer: Buffer, publicId: string) {
    const bucket = this.S3_BUCKET_THUMBS;

    const fileName =
      'thumbs/' + path.parse(publicId).name.replace(/\s/g, '') + '.png';

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
    const bucket = this.S3_BUCKET_THUMBS;
    const url = this.getPublicFileUrl(key, bucket);
    return url;
  }

  private getPublicFileUrl(key: string, bucket: string) {
    const region = this.region;
    return `https://${bucket}.s3.${region}.backblazeb2.com/${key}`; // TODO: make possible to use custom domain
  }

  public async deleteSong(nbsFileUrl: string) {
    const bucket = this.S3_BUCKET_SONGS;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: nbsFileUrl,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error('Error deleting file: ', error);
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
      this.logger.error('Error uploading file: ', error);
      throw error;
    }
  }

  public async getSongFile(nbsFileUrl: string): Promise<ArrayBuffer> {
    const bucket = this.S3_BUCKET_SONGS;

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
      this.logger.error('Error getting file: ', error);
      throw error;
    }
  }
}
