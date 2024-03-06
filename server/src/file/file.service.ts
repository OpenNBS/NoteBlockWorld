import * as path from 'path';

import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  s3Client = this.getS3Client();

  constructor(private readonly configService: ConfigService) {}

  private getS3Client() {
    // Load environment variables
    const key = this.configService.get<string>('S3_KEY');
    const secret = this.configService.get<string>('S3_SECRET');
    if (!key || !secret) {
      throw new Error('Missing S3_KEY or S3_SECRET environment variable');
    }

    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    if (!endpoint) {
      throw new Error('Missing S3_ENDPOINT environment variable');
    }

    const region = this.configService.get<string>('S3_REGION');
    if (!region) {
      throw new Error('Missing S3_REGION environment variable');
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

  public async uploadSong(file: Express.Multer.File) {
    console.log(file);
    const bucket =
      this.configService.get<string>('S3_BUCKET') || 'noteblockworld-songs';
    const fileName =
      path.parse(file.originalname).name.replace(/\s/g, '') + '_' + uuidv4();
    const extension = path.parse(file.originalname).ext;
    const newFileName = `${fileName}${extension}`;

    return await this.s3_upload(file, bucket, newFileName, file.mimetype);
  }

  public async uploadThumbnail(file: Express.Multer.File) {
    throw new Error('Method not implemented.');
  }

  public async uploadProfilePicture(file: Express.Multer.File) {
    throw new Error('Method not implemented.');
  }

  async s3_upload(
    file: Express.Multer.File,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file.buffer,
      ACL: ObjectCannedACL.private,
      ContentType: mimetype,
      ContentDisposition: 'inline',
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
}
