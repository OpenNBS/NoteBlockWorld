// TODO: check if types are still necessary in the frontend (use types from shared/ module)

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
  uploader: {
    username: string;
    profileImage: string;
  };
  duration: number;
  thumbnailUrl: string;
  createdAt: Date;
  playCount: number;
};
