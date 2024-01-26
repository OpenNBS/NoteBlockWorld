import { UserDocument } from '@server/user/entity/user.entity';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';
export class SongPreviewDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @IsUUID()
  uploader: HydratedDocument<UserDocument>;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  originalAuthor: string;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  noteCount: number;

  @IsNotEmpty()
  @IsUrl()
  coverImageUrl: string;
}
