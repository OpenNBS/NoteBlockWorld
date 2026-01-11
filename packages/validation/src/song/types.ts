import { TIMESPANS, UPLOAD_CONSTANTS } from '@nbw/config';

import type { CustomInstrumentData } from './CustomInstrumentData.dto';
import type { FeaturedSongsDto } from './FeaturedSongsDto.dto';
import type { SongPageDto } from './SongPage.dto';
import type { SongPreviewDto } from './SongPreview.dto';
import type { SongViewDto } from './SongView.dto';
import type { ThumbnailData } from './ThumbnailData.dto';
import type { UploadSongDto } from './UploadSongDto.dto';
import type { UploadSongResponseDto } from './UploadSongResponseDto.dto';

export type UploadSongDtoType = UploadSongDto;

export type UploadSongNoFileDtoType = Omit<UploadSongDtoType, 'file'>;

export type UploadSongResponseDtoType = UploadSongResponseDto;

export type SongViewDtoType = SongViewDto;

export type SongPreviewDtoType = SongPreviewDto;

export type SongPageDtoType = SongPageDto;

export type CustomInstrumentDataType = CustomInstrumentData;

export type FeaturedSongsDtoType = FeaturedSongsDto;

export type ThumbnailDataType = ThumbnailData;

export type VisibilityType = keyof typeof UPLOAD_CONSTANTS.visibility;

export type CategoryType = keyof typeof UPLOAD_CONSTANTS.categories;

export type LicenseType = keyof typeof UPLOAD_CONSTANTS.licenses;

export type SongsFolder = Record<number, SongPageDtoType>;

export type TimespanType = (typeof TIMESPANS)[number];
