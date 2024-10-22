import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SongStats } from '@shared/validation/song/dto/SongStats';
import { SongViewUploader } from '@shared/validation/song/dto/SongView.dto';
import { ThumbnailData } from '@shared/validation/song/dto/ThumbnailData.dto';
import type {
  CategoryType,
  LicenseType,
  VisibilityType,
} from '@shared/validation/song/dto/types';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
    },
  },
})
export class Song {
  @Prop({ type: String, required: true, unique: true })
  publicId: string;

  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  uploader: Types.ObjectId;

  @Prop({ type: String, required: true })
  thumbnailUrl: string;

  @Prop({ type: String, required: true })
  nbsFileUrl: string;

  @Prop({ type: String, required: true })
  packedSongUrl: string;

  // SONG DOCUMENT ATTRIBUTES

  @Prop({ type: Number, required: true, default: 0 })
  playCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  downloadCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  likeCount: number;

  // SONG FILE ATTRIBUTES (Populated from upload form - updatable)

  @Prop({ type: ThumbnailData, required: true })
  thumbnailData: ThumbnailData;

  @Prop({ type: String, required: true })
  category: CategoryType;

  @Prop({ type: String, required: true })
  visibility: VisibilityType;

  @Prop({ type: String, required: true })
  license: LicenseType;

  @Prop({ type: Array<string>, required: true })
  customInstruments: string[];

  @Prop({ type: Boolean, required: true, default: true })
  allowDownload: boolean;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  originalAuthor: string;

  @Prop({ type: String, required: false })
  description: string;

  // SONG FILE ATTRIBUTES (Populated from NBS file - immutable)

  @Prop({ type: Number, required: true })
  fileSize: number;

  @Prop({ type: SongStats, required: true })
  stats: SongStats;

  // EXTERNAL ATTRIBUTES

  @Prop({ type: String, required: false })
  webhookMessageId?: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);

export type SongDocument = Song & HydratedDocument<Song>;

export type SongWithUser = Omit<Song, 'uploader'> & {
  uploader: SongViewUploader;
};
