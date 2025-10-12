import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import type { Client, CollectionFieldSchema } from 'typesense';

import type { SongPreviewDto } from '@nbw/database';

export interface SongSearchDocument {
  id: string;
  publicId: string;
  title: string;
  originalAuthor: string;
  description: string;
  uploaderUsername: string;
  uploaderDisplayName: string;
  category: string;
  playCount: number;
  likeCount: number;
  downloadCount: number;
  createdAt: number;
  thumbnailUrl: string;
  duration: number;
  noteCount: number;
}

@Injectable()
export class TypesenseService implements OnModuleInit {
  private readonly logger = new Logger(TypesenseService.name);
  private readonly collectionName = 'songs';

  constructor(
    @Inject('TYPESENSE_CLIENT')
    private readonly client: Client,
  ) {}

  async onModuleInit() {
    await this.initializeCollection();
  }

  private async initializeCollection() {
    try {
      // Check if collection exists
      await this.client.collections(this.collectionName).retrieve();
      this.logger.log(`Collection '${this.collectionName}' already exists`);
    } catch (error) {
      // Collection doesn't exist, create it
      this.logger.log(`Creating collection '${this.collectionName}'...`);

      const schema = {
        name: this.collectionName,
        fields: [
          { name: 'publicId', type: 'string' as const, facet: false },
          { name: 'title', type: 'string' as const, facet: false },
          {
            name: 'originalAuthor',
            type: 'string' as const,
            facet: false,
            optional: true,
          },
          {
            name: 'description',
            type: 'string' as const,
            facet: false,
            optional: true,
          },
          { name: 'uploaderUsername', type: 'string' as const, facet: true },
          {
            name: 'uploaderDisplayName',
            type: 'string' as const,
            facet: false,
          },
          { name: 'category', type: 'string' as const, facet: true },
          { name: 'playCount', type: 'int32' as const, facet: false },
          { name: 'likeCount', type: 'int32' as const, facet: false },
          { name: 'downloadCount', type: 'int32' as const, facet: false },
          { name: 'createdAt', type: 'int64' as const, facet: false },
          { name: 'thumbnailUrl', type: 'string' as const, facet: false },
          { name: 'duration', type: 'float' as const, facet: false },
          { name: 'noteCount', type: 'int32' as const, facet: false },
        ] as CollectionFieldSchema[],
        default_sorting_field: 'createdAt',
      };

      await this.client.collections().create(schema);
      this.logger.log(
        `Collection '${this.collectionName}' created successfully`,
      );
    }
  }

  async indexSongs(songs: SongPreviewDto[]): Promise<void> {
    if (songs.length === 0) {
      return;
    }

    const documents: SongSearchDocument[] = songs.map((song) => ({
      id: song.publicId,
      publicId: song.publicId,
      title: song.title,
      originalAuthor: song.originalAuthor || '',
      description: song.description || '',
      uploaderUsername: song.uploader.username,
      uploaderDisplayName: song.uploader.displayName,
      category: song.category,
      playCount: song.playCount,
      likeCount: song.likeCount,
      downloadCount: song.downloadCount,
      createdAt: new Date(song.createdAt).getTime(),
      thumbnailUrl: song.thumbnailUrl,
      duration: song.stats.duration,
      noteCount: song.stats.noteCount,
    }));

    try {
      const result = await this.client
        .collections<SongSearchDocument>(this.collectionName)
        .documents()
        .import(documents, { action: 'upsert' });

      const successCount = result.filter((r) => r.success).length;
      const errorCount = result.filter((r) => !r.success).length;

      this.logger.log(
        `Indexed ${successCount} songs successfully, ${errorCount} errors`,
      );

      if (errorCount > 0) {
        const errors = result
          .filter((r) => !r.success)
          .map((r) => r.error)
          .slice(0, 5); // Log first 5 errors
        this.logger.error('Sample indexing errors:', errors);
      }
    } catch (error) {
      this.logger.error('Error indexing songs:', error);
      throw error;
    }
  }

  async searchSongs(
    query: string,
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      category?: string;
    } = {},
  ): Promise<SongPreviewDto[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt:desc',
      category,
    } = options;

    try {
      const searchParameters: any = {
        q: query,
        query_by:
          'title,originalAuthor,description,uploaderUsername,uploaderDisplayName',
        page,
        per_page: limit,
        sort_by: sortBy,
      };

      if (category) {
        searchParameters.filter_by = `category:=${category}`;
      }

      const searchResults = await this.client
        .collections<SongSearchDocument>(this.collectionName)
        .documents()
        .search(searchParameters);

      // Convert Typesense results back to SongPreviewDto format
      return (
        searchResults.hits?.map((hit) => {
          const doc = hit.document;
          return {
            publicId: doc.publicId,
            title: doc.title,
            originalAuthor: doc.originalAuthor,
            description: doc.description,
            uploader: {
              username: doc.uploaderUsername,
              displayName: doc.uploaderDisplayName,
            },
            category: doc.category as any,
            playCount: doc.playCount,
            likeCount: doc.likeCount,
            downloadCount: doc.downloadCount,
            createdAt: new Date(doc.createdAt).toISOString(),
            thumbnailUrl: doc.thumbnailUrl,
            stats: {
              duration: doc.duration,
              noteCount: doc.noteCount,
            },
          } as SongPreviewDto;
        }) || []
      );
    } catch (error) {
      this.logger.error('Error searching songs:', error);
      throw error;
    }
  }

  async deleteSong(publicId: string): Promise<void> {
    try {
      await this.client
        .collections(this.collectionName)
        .documents(publicId)
        .delete();
      this.logger.log(`Deleted song ${publicId} from search index`);
    } catch (error) {
      this.logger.error(`Error deleting song ${publicId}:`, error);
      throw error;
    }
  }

  async recreateCollection(): Promise<void> {
    try {
      await this.client.collections(this.collectionName).delete();
      this.logger.log(`Collection '${this.collectionName}' deleted`);
    } catch (error) {
      this.logger.warn(
        `Collection '${this.collectionName}' doesn't exist or error deleting:`,
        error,
      );
    }

    await this.initializeCollection();
  }
}
