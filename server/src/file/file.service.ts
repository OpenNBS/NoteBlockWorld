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
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = this.getS3Client();
  }

  private getS3Client() {
    // Load environment variables
    const key = this.configService.get<string>('S3_KEY');
    const secret = this.configService.get<string>('S3_SECRET');
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const region = this.configService.get<string>('S3_REGION');
    const bucket = this.configService.get<string>('S3_BUCKET');

    if (!key || !secret || !endpoint || !region || !bucket) {
      throw new Error('Missing S3 configuration');
    }

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
  public async uploadSong(file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  }) {
    console.log(file);

    const bucket =
      this.configService.get<string>('S3_BUCKET') || 'noteblockworld-songs';

    const fileName =
      path.parse(file.originalname).name.replace(/\s/g, '') + '_' + uuidv4();

    const extension = path.parse(file.originalname).ext;
    const newFileName = `${fileName}${extension}`;

    await this.s3_upload(
      file.buffer,
      bucket,
      newFileName,
      file.mimetype,
      ObjectCannedACL.private,
    );

    return newFileName;
  }

  public async getSongDownloadUrl(key: string, filename: string) {
    const bucket = this.configService.get<string>('S3_BUCKET');

    if (!bucket) {
      throw new Error('Missing S3_BUCKET environment variable');
    }

    console.log('bucket', bucket);
    console.log('key', key);

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename=${filename}`,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 2 * 60, // 2 minutes
    });

    return signedUrl;
  }

  public async uploadThumbnail(buffer: Buffer, filename: string) {
    // TODO: standardize the bucket name access
    const bucket =
      this.configService.get<string>('S3_BUCKET_THUMBS') ||
      'noteblockworld-thumbs';

    await this.s3_upload(
      buffer,
      bucket,
      filename,
      'image/jpeg',
      ObjectCannedACL.public_read,
    );

    return this.getThumbnailUrl(filename);
  }

  public getThumbnailUrl(key: string) {
    const bucket =
      this.configService.get<string>('S3_BUCKET_THUMBS') ||
      'noteblockworld-thumbs';

    const region = this.configService.get<string>('S3_REGION') || '';
    const url = this.getPublicFileUrl(key, bucket, region);

    return url;
  }

  private getPublicFileUrl(key: string, bucket: string, region: string) {
    return `https://${bucket}.s3.${region}.backblazeb2.com/${key}`;
  }

  public async uploadProfilePicture(file: Express.Multer.File) {
    // TODO: verify if this is working correctly
    const bucket =
      this.configService.get<string>('S3_BUCKET_PROFILE') ||
      'noteblockworld-profiles';

    const fileName = uuidv4();

    await this.s3_upload(
      file.buffer,
      bucket,
      fileName,
      file.mimetype,
      ObjectCannedACL.public_read,
    );

    return this.getProfilePictureUrl(fileName);
  }

  public async getProfilePictureUrl(fileName: string) {
    // TODO: verify if this is working correctly
    const bucket =
      this.configService.get<string>('S3_BUCKET_PROFILE') ||
      'noteblockworld-profiles';

    const region = this.configService.get<string>('S3_REGION') || '';
    const url = this.getPublicFileUrl(fileName, bucket, region);

    return url;
  }

  public async deleteSong(nbsFileUrl: string) {
    const bucket = this.configService.get<string>('S3_BUCKET');

    if (!bucket) {
      throw new Error('Missing S3_BUCKET environment variable');
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: nbsFileUrl,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file: ', error);
      throw error;
    } finally {
      // finally
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
      ContentDisposition: 'attachment; filename=' + name,
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    const command = new PutObjectCommand(params);

    try {
      const s3Response = await this.s3Client.send(command);
      console.log(s3Response);

      return s3Response;
    } catch (error) {
      console.error('Error uploading file: ', error);
      throw error;
    } finally {
      // finally
    }
  }

  public async getSongFile(nbsFileUrl: string): Promise<ArrayBuffer> {
    // TODO: verify if this is working correctly
    const bucket = this.configService.get<string>('S3_BUCKET');

    if (!bucket) {
      throw new Error('Missing S3_BUCKET environment variable');
    }

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
    } finally {
      // finally
    }
  }
}
