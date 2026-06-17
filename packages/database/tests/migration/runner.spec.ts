import { describe, expect, it } from 'bun:test';

import {
  CURRENT_SONG_SCHEMA_VERSION,
  SONG_MIGRATION_REGISTRY,
  SONG_PENDING_QUERY_CLAUSES,
} from '../../src/migration/collections/song.migrations';
import {
  buildPendingQuery,
  getPendingMigrations,
  isFullyMigrated,
  migrateDocument,
} from '../../src/migration/runner';

describe('migration runner', () => {
  it('returns no pending migrations for a fully migrated song document', () => {
    const doc = {
      schemaVersion: CURRENT_SONG_SCHEMA_VERSION,
      stats: {
        nbsVersion: 5,
        firstCustomInstrumentIndex: 16,
      },
    };

    expect(getPendingMigrations(SONG_MIGRATION_REGISTRY, doc)).toEqual([]);
    expect(isFullyMigrated(SONG_MIGRATION_REGISTRY, doc)).toBe(true);
  });

  it('applies song migration 1 to legacy documents', () => {
    const doc = {
      schemaVersion: 0,
      stats: {
        noteCount: 10,
      },
    };

    const migrated = migrateDocument(SONG_MIGRATION_REGISTRY, doc);

    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.stats.nbsVersion).toBe(5);
    expect(migrated.stats.noteCount).toBe(10);
  });

  it('stamps schemaVersion when stats fields exist but version is missing', () => {
    const doc = {
      stats: {
        nbsVersion: 5,
        firstCustomInstrumentIndex: 16,
      },
    };

    const migrated = migrateDocument(SONG_MIGRATION_REGISTRY, doc);

    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.stats.nbsVersion).toBe(5);
  });

  it('builds a pending query with schema and field guards', () => {
    expect(
      buildPendingQuery(SONG_MIGRATION_REGISTRY, SONG_PENDING_QUERY_CLAUSES),
    ).toEqual({
      $or: [
        { schemaVersion: { $exists: false } },
        { schemaVersion: { $lt: CURRENT_SONG_SCHEMA_VERSION } },
        { 'stats.nbsVersion': { $exists: false } },
      ],
    });
  });
});
