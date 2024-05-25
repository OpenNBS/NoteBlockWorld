import { CustomInstrumentData } from './CustomInstrumentData.dto';
import { DeleteSongDto } from './DeleteSong.dto';
import { SongDto } from './Song.dto';
import { SongPageDto } from './SongPageDto';
import { SongPreviewDto } from './SongPreview.dto';
import { SongViewDto } from './SongView.dto';
import { ThumbnailData as ThumbnailData } from './ThumbnailData.dto';
import { UploadSongDto } from './UploadSongDto.dto';
import { UploadSongResponseDto } from './UploadSongResponseDto.dto';
import { UploadConst } from '../constants';

export type UploadSongDtoType = InstanceType<typeof UploadSongDto>;
export type UploadSongResponseDtoType = InstanceType<
  typeof UploadSongResponseDto
>;
export type SongViewDtoType = InstanceType<typeof SongViewDto>;
export type SongPreviewDtoType = InstanceType<typeof SongPreviewDto>;
export type SongPageDtoType = InstanceType<typeof SongPageDto>;
export type SongDtoType = InstanceType<typeof SongDto>;
export type DeleteSongDtoType = InstanceType<typeof DeleteSongDto>;
export type CustomInstrumentDataType = InstanceType<
  typeof CustomInstrumentData
>;
export type ThumbnailDataType = InstanceType<typeof ThumbnailData>;

export type VisibilityType = keyof typeof UploadConst.visibility;
export type CategoryType = keyof typeof UploadConst.categories;
export type LicenseType = keyof typeof UploadConst.licenses;
