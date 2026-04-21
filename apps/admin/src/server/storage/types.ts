export type StorageBucket = 'songs' | 'thumbs';

export type PutObjectInput = {
  bucket: StorageBucket;
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
  acl?: 'private' | 'public-read';
};

export type SignedDownloadInput = {
  bucket: StorageBucket;
  key: string;
  filename: string;
  expiresInSeconds?: number;
};

export interface ObjectStorageClient {
  verifyBuckets(): Promise<void>;
  putObject(input: PutObjectInput): Promise<void>;
  deleteObject(bucket: StorageBucket, key: string): Promise<void>;
  getSignedDownloadUrl(input: SignedDownloadInput): Promise<string>;
  getPublicUrl(bucket: StorageBucket, key: string): string;
}
