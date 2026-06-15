import type {
  DocumentMigration,
  MigrationRegistry,
  PendingQueryClause,
  SchemaVersionedDocument,
} from './types';

export function getDocumentSchemaVersion(doc: SchemaVersionedDocument): number {
  return doc.schemaVersion ?? 0;
}

export function getPendingMigrations<TDoc extends SchemaVersionedDocument>(
  registry: MigrationRegistry<TDoc>,
  doc: TDoc,
): DocumentMigration<TDoc>[] {
  const schemaVersion = getDocumentSchemaVersion(doc);

  return registry.migrations.filter(
    (migration) =>
      schemaVersion < migration.version || migration.needsMigration(doc),
  );
}

export function migrateDocument<TDoc extends SchemaVersionedDocument>(
  registry: MigrationRegistry<TDoc>,
  doc: TDoc,
): TDoc {
  let result = doc;
  const pending = getPendingMigrations(registry, doc);

  for (const migration of pending) {
    result = migration.apply(result);
    result.schemaVersion = migration.version;
  }

  return result;
}

export function isFullyMigrated<TDoc extends SchemaVersionedDocument>(
  registry: MigrationRegistry<TDoc>,
  doc: TDoc,
): boolean {
  if (getDocumentSchemaVersion(doc) < registry.currentVersion) {
    return false;
  }

  return !registry.migrations.some((migration) =>
    migration.needsMigration(doc),
  );
}

export function buildPendingQuery<TDoc extends SchemaVersionedDocument>(
  registry: MigrationRegistry<TDoc>,
  extraClauses: PendingQueryClause[] = [],
): { $or: PendingQueryClause[] } {
  const clauses: PendingQueryClause[] = [
    { schemaVersion: { $exists: false } },
    { schemaVersion: { $lt: registry.currentVersion } },
    ...extraClauses,
  ];

  return { $or: clauses };
}
