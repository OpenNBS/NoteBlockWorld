import type { DatabaseModels } from '@admin/db/models';
import type { AdminEnvironment } from '@admin/env';
import type { ObjectStorageClient } from '@admin/storage/types';

export type ServiceContext = {
  env: AdminEnvironment;
  models: DatabaseModels;
  storage: ObjectStorageClient;
  startedAt: number;
};
