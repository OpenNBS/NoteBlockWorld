import type { Song } from '../../song/entity/song.entity';
import type { MigrationRegistry } from '../types';

export const CURRENT_SONG_SCHEMA_VERSION = 1;

type SongMigrationDoc = Pick<Song, 'schemaVersion' | 'stats'>;

function songNeedsMigration1(doc: SongMigrationDoc): boolean {
  const schemaVersion = doc.schemaVersion ?? 0;

  return schemaVersion < 1 || doc.stats?.nbsVersion == null;
}

function applySongMigration1(doc: SongMigrationDoc): SongMigrationDoc {
  return {
    ...doc,
    stats: {
      ...doc.stats,
      nbsVersion: doc.stats?.nbsVersion ?? 5,
    },
  };
}

export const SONG_MIGRATION_REGISTRY: MigrationRegistry<SongMigrationDoc> = {
  collection: 'songs',
  currentVersion: CURRENT_SONG_SCHEMA_VERSION,
  migrations: [
    {
      version: 1,
      name: 'add-nbs-version-stats',
      collection: 'songs',
      needsMigration: songNeedsMigration1,
      apply: applySongMigration1,
    },
  ],
};

export const SONG_PENDING_QUERY_CLAUSES = [
  { 'stats.nbsVersion': { $exists: false } },
];
