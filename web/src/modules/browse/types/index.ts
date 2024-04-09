export type FeaturedTimespan =
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'all';

export type SongPreview = {
  id: string;
  title: string;
  uploader: string;
  duration: number;
  thumbnailUrl: string;
  createdAt: Date;
  playCount: number;
};
