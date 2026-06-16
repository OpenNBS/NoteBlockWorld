export interface SchemaVersionedDocument {
  schemaVersion?: number;
}

export interface DocumentMigration<TDoc extends SchemaVersionedDocument> {
  version: number;
  name: string;
  collection: string;
  needsMigration(doc: TDoc): boolean;
  apply(doc: TDoc): TDoc;
}

export interface MigrationRegistry<TDoc extends SchemaVersionedDocument> {
  collection: string;
  currentVersion: number;
  migrations: DocumentMigration<TDoc>[];
}

export interface PendingQueryClause {
  [key: string]: unknown;
}
