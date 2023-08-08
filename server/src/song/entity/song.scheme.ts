import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Integer } from 'mongoose';
import { title } from 'process';

enum VisibilityEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

class SongInterface {
  uploadDate: Date;
  uploader: ObjectId;
  playCount: number; //int
  downloadCount: number; //int
  likeCount: number;
  allowDownload: boolean;
  visibility: VisibilityEnum;
  title: string;
  author: string;
  originalAuthor: string;
  description: string;
  coverImage: string; // URL
  nbsFileUrl: string; // URL
  instrumentsFileUrl?: string; // URL
  content: string;
  noteCount: number; // int
  length: number; // int
  category: string;
}

//class SongAttributes {
//    title
//    downloadCount
//    likeCount
//    author
//    originalAuthor
//    description
//    coverImage
//    noteCount
//    length
//    category
//}

export type SongDocument = HydratedDocument<Song>;

@Schema()
export class Song implements SongInterface {
  @Prop({ required: true })
  uploadDate: Date;

  @Prop({ required: true })
  uploader: ObjectId;

  @Prop({ required: true })
  playCount: number;

  @Prop({ required: true })
  downloadCount: number;

  @Prop({
    required: true,
    default: 0,
    type: Integer,
  })
  likeCount: number;

  @Prop({ required: true })
  allowDownload: boolean;

  @Prop({ required: true })
  visibility: VisibilityEnum;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  originalAuthor: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  coverImage: string;

  @Prop({ required: true })
  nbsFileUrl: string;

  @Prop({ required: true })
  instrumentsFileUrl: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  noteCount: number;

  @Prop({ required: true })
  length: number;

  @Prop({ required: true })
  category: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);
