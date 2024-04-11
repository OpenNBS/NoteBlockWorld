export type FeaturedTimespan =
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'all';

export type SongPreview = {
  publicId: string;
  title: string;
  uploader: string;
  duration: number;
  thumbnailUrl: string;
  createdAt: Date;
  playCount: number;
};
