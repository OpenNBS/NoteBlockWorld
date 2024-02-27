import * as path from 'path';

import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables

const configService = new ConfigService();

const key = configService.get('S3_KEY');
const secret = configService.get('S3_SECRET');
if (!key || !secret) {
  throw new Error('Missing S3_KEY or S3_SECRET environment variable');
}

const endpoint = configService.get('S3_ENDPOINT');
if (!endpoint) {
  throw new Error('Missing S3_ENDPOINT environment variable');
}

const region = configService.get('S3_REGION');
if (!region) {
  throw new Error('Missing S3_REGION environment variable');
}

const bucketName = configService.get('S3_BUCKET');
if (!bucketName) {
  throw new Error('Missing S3_BUCKET environment variable');
}

// Create S3 client
const s3Config = new S3Client({
  region: region,
  endpoint: endpoint,
  credentials: {
    accessKeyId: key, //chave de acesso
    secretAccessKey: secret, //chave de acesso secreta
  },
});

// Multer configuration
const multerConfig = {
  storage: multerS3({
    s3: s3Config,
    bucket: bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const fileName =
        path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();

      const extension = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extension}`);
    },
  }),
};

export default multerConfig;
