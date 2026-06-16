import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Song,
  SONG_MIGRATION_REGISTRY,
  SONG_PENDING_QUERY_CLAUSES,
  buildPendingQuery,
  isFullyMigrated,
  migrateDocument,
  type MigrationRegistry,
} from '@nbw/database';

export interface MigrationBatchResult {
  collection: string;
  matched: number;
  migrated: number;
  errors: string[];
}

export interface MigrationStatus {
  collection: string;
  currentVersion: number;
  pendingCount: number;
}

const DEFAULT_BATCH_SIZE = 500;

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  private readonly registries = new Map<string, MigrationRegistry<object>>([
    [SONG_MIGRATION_REGISTRY.collection, SONG_MIGRATION_REGISTRY],
  ]);

  constructor(
    @InjectModel(Song.name)
    private readonly songModel: Model<Song>,
  ) {}

  async getMigrationStatus(collection: string): Promise<MigrationStatus> {
    const registry = this.getRegistry(collection);
    const model = this.getModel(collection);
    const pendingQuery = this.buildRegistryPendingQuery(collection);

    const pendingCount = await model.countDocuments(pendingQuery);

    return {
      collection,
      currentVersion: registry.currentVersion,
      pendingCount,
    };
  }

  async runAllPendingMigrations(options?: {
    batchSize?: number;
  }): Promise<MigrationBatchResult[]> {
    const results: MigrationBatchResult[] = [];

    for (const collection of this.registries.keys()) {
      results.push(await this.runBulkMigration(collection, options));
    }

    return results;
  }

  async runBulkMigration(
    collection: string,
    options?: { batchSize?: number },
  ): Promise<MigrationBatchResult> {
    const registry = this.getRegistry(collection);
    const model = this.getModel(collection);
    const batchSize = options?.batchSize ?? DEFAULT_BATCH_SIZE;
    const pendingQuery = this.buildRegistryPendingQuery(collection);

    const matched = await model.countDocuments(pendingQuery);

    if (matched === 0) {
      this.logger.log(
        `No pending migrations for ${collection} (current version ${registry.currentVersion})`,
      );

      return {
        collection,
        matched: 0,
        migrated: 0,
        errors: [],
      };
    }

    this.logger.log(
      `Migrating ${matched} ${collection} document(s) to schema version ${registry.currentVersion}`,
    );

    let migrated = 0;
    const errors: string[] = [];
    let lastId: unknown;

    while (true) {
      const query = lastId
        ? { ...pendingQuery, _id: { $gt: lastId } }
        : pendingQuery;

      const batch = await model
        .find(query)
        .sort({ _id: 1 })
        .limit(batchSize)
        .exec();

      if (batch.length === 0) {
        break;
      }

      for (const doc of batch) {
        try {
          if (isFullyMigrated(registry, doc)) {
            lastId = doc._id;
            continue;
          }

          const updated = migrateDocument(registry, doc.toObject());

          doc.set(updated);
          await doc.save();
          migrated++;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          errors.push(`${doc._id}: ${message}`);
        }

        lastId = doc._id;
      }
    }

    if (errors.length > 0) {
      throw new Error(
        `Migration failed for ${collection}: ${errors.join('; ')}`,
      );
    }

    this.logger.log(
      `Migrated ${migrated}/${matched} ${collection} document(s)`,
    );

    return {
      collection,
      matched,
      migrated,
      errors,
    };
  }

  private getRegistry(collection: string): MigrationRegistry<object> {
    const registry = this.registries.get(collection);

    if (!registry) {
      throw new Error(`No migration registry registered for ${collection}`);
    }

    return registry;
  }

  private getModel(collection: string): Model<Song> {
    if (collection === SONG_MIGRATION_REGISTRY.collection) {
      return this.songModel;
    }

    throw new Error(`No model registered for ${collection}`);
  }

  private buildRegistryPendingQuery(collection: string) {
    if (collection === SONG_MIGRATION_REGISTRY.collection) {
      return buildPendingQuery(
        SONG_MIGRATION_REGISTRY,
        SONG_PENDING_QUERY_CLAUSES,
      );
    }

    return buildPendingQuery(this.getRegistry(collection));
  }
}
