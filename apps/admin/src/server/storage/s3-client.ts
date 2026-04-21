import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import type { AdminEnvironment } from '@admin/env';

import type {
  ObjectStorageClient,
  PutObjectInput,
  SignedDownloadInput,
  StorageBucket,
} from './types';

const ACL_MAP: Record<NonNullable<PutObjectInput['acl']>, ObjectCannedACL> = {
  private: ObjectCannedACL.private,
  'public-read': ObjectCannedACL.public_read,
};

export function createS3StorageClient(
  env: AdminEnvironment,
): ObjectStorageClient {
  const bucketByName: Record<StorageBucket, string> = {
    songs: env.S3_BUCKET_SONGS,
    thumbs: env.S3_BUCKET_THUMBS,
  };

  const s3 = new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_KEY,
      secretAccessKey: env.S3_SECRET,
    },
    forcePathStyle: env.S3_ENDPOINT.includes('localhost'),
  });

  const resolveBucket = (bucket: StorageBucket) => bucketByName[bucket];

  return {
    async verifyBuckets() {
      await Promise.all(
        Object.values(bucketByName).map((bucket) =>
          s3.send(new HeadBucketCommand({ Bucket: bucket })),
        ),
      );
    },

    async putObject(input: PutObjectInput) {
      const command = new PutObjectCommand({
        Bucket: resolveBucket(input.bucket),
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
        ACL: ACL_MAP[input.acl ?? 'private'],
      });

      await s3.send(command);
    },

    async deleteObject(bucket: StorageBucket, key: string) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: resolveBucket(bucket),
          Key: key,
        }),
      );
    },

    async getSignedDownloadUrl(input: SignedDownloadInput) {
      const command = new GetObjectCommand({
        Bucket: resolveBucket(input.bucket),
        Key: input.key,
        ResponseContentDisposition: `attachment; filename="${input.filename.replace(
          /[/"]/g,
          '_',
        )}"`,
      });

      return getSignedUrl(s3, command, {
        expiresIn: input.expiresInSeconds ?? 120,
      });
    },

    getPublicUrl(bucket: StorageBucket, key: string) {
      const bucketName = resolveBucket(bucket);
      if (env.S3_ENDPOINT.includes('localhost')) {
        return `${env.S3_ENDPOINT}/${bucketName}/${key}`;
      }

      return `https://${bucketName}.s3.${env.S3_REGION}.backblazeb2.com/${key}`;
    },
  };
}
