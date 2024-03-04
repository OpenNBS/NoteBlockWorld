import path from 'path';

import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import multerS3 from 'multer-s3';
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

  public getMulterConfig() {
    const bucketName = this.configService.get<string>('S3_BUCKET');
    if (!bucketName) {
      throw new Error('Missing S3_BUCKET environment variable');
    }

    const multerConfig = {
      storage: multerS3({
        s3: this.s3Client,
        bucket: bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
          const fileName =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            '-' +
            uuidv4();

          const extension = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
    };
    return multerConfig;
  }
}
