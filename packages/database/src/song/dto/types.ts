import { CustomInstrumentData } from './CustomInstrumentData.dto';
import { FeaturedSongsDto } from './FeaturedSongsDto.dto';
import { SongPageDto } from './SongPage.dto';
import { SongPreviewDto } from './SongPreview.dto';
import { SongViewDto } from './SongView.dto';
import { ThumbnailData as ThumbnailData } from './ThumbnailData.dto';
import { UploadSongDto } from './UploadSongDto.dto';
import { UploadSongResponseDto } from './UploadSongResponseDto.dto';
import { UploadConst, timespans } from '../constants';

export type UploadSongDtoType = InstanceType<typeof UploadSongDto>;

export type UploadSongNoFileDtoType = Omit<UploadSongDtoType, 'file'>;

export type UploadSongResponseDtoType = InstanceType<
  typeof UploadSongResponseDto
>;

export type SongViewDtoType = InstanceType<typeof SongViewDto>;

export type SongPreviewDtoType = InstanceType<typeof SongPreviewDto>;

export type SongPageDtoType = InstanceType<typeof SongPageDto>;

export type CustomInstrumentDataType = InstanceType<
  typeof CustomInstrumentData
>;

export type FeaturedSongsDtoType = InstanceType<typeof FeaturedSongsDto>;

export type ThumbnailDataType = InstanceType<typeof ThumbnailData>;

export type VisibilityType = keyof typeof UploadConst.visibility;

export type CategoryType = keyof typeof UploadConst.categories;

export type LicenseType = keyof typeof UploadConst.licenses;

export type SongsFolder = Record<number, SongPageDtoType>;

export type TimespanType = (typeof timespans)[number];
