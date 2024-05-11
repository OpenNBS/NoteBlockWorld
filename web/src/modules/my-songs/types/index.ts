export type MySongsSongDTO = {
  publicId: string;
  description: string;
  visibility: 'public' | 'private';
  uploader?: string;
  title: string;
  originalAuthor: string;
  duration: number;
  noteCount: number;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
};

export type SongsPagination = Array<MySongsSongDTO>;

export type SongsPage = {
  content: SongsPagination;
  total: number;
  page: number;
  pageSize: number;
};
export type SongsFolder = Record<number, SongsPage>;
