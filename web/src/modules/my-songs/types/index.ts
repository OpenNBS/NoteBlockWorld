import {
  SongPageDtoType,
  SongPreviewDtoType,
} from '@shared/validation/song/dto/types';

export type MySongsSongDTO = SongPreviewDtoType;

export type SongsPagination = Array<MySongsSongDTO>;

export type SongsPage = SongPageDtoType;
export type SongsFolder = Record<number, SongsPage>;
