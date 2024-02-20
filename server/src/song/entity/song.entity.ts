import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';
import { CoverData } from '../dto/CoverData.dto';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      // TODO: hydrate uploader
      //if (ret.uploader) {
      //  ret.uploader = ret.uploader.toJSON();
      //}
    },
  },
})
export class Song {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  uploader: ObjectId;

  @Prop({ type: String, required: true })
  thumbnailUrl: string;

  @Prop({ type: String, required: true })
  nbsFileUrl: string;

  // SONG DOCUMENT ATTRIBUTES

  @Prop({ type: Number, required: true, default: 0 })
  playCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  downloadCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  likeCount: number;

  // SONG FILE ATTRIBUTES (Populated from upload form - updatable)

  @Prop({ type: CoverData, required: true })
  thumbnail: CoverData;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, required: true })
  visibility: 'public' | 'private';

  @Prop({ type: Number, required: true, default: true })
  allowDownload: boolean;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  originalAuthor: string;

  @Prop({ type: String, required: true })
  description: string;

  // SONG FILE ATTRIBUTES (Populated from NBS file - immutable)

  // TODO: group these into a SongStats object?
  //@Prop( {type: SongStats, required: false} )

  @Prop({ type: MongooseSchema.Types.Buffer, required: false })
  _content: Buffer; // Used for playback

  @Prop({ type: Array<String>, required: false })
  _sounds: string[]; // Used for playback

  @Prop({ type: Number, required: false })
  fileSize: number;

  @Prop({ type: Boolean, required: false })
  compatible: boolean;

  @Prop({ type: String, required: false })
  midiFileName: string;

  @Prop({ type: Number, required: false })
  noteCount: number;

  @Prop({ type: Number, required: false })
  vanillaInstrumentCount: number;

  @Prop({ type: Number, required: false })
  customInstrumentCount: number;

  @Prop({ type: Number, required: false })
  tickCount: number;

  @Prop({ type: Number, required: false })
  layerCount: number;

  @Prop({ type: Number, required: false })
  tempo: number;

  @Prop({ type: Array<Number>, required: false })
  tempoRange: number[];

  @Prop({ type: Array<Number>, required: false })
  timeSignature: number;

  @Prop({ type: Array<Number>, required: false })
  duration: number;

  @Prop({ type: Boolean, required: false })
  loop: boolean;

  @Prop({ type: Number, required: false })
  loopStartTick: number;

  @Prop({ type: Number, required: false })
  minutesSpent: number;

  @Prop({ type: Number, required: false })
  leftClicks: number;

  @Prop({ type: Number, required: false })
  rightClicks: number;
}

export const SongSchema = SchemaFactory.createForClass(Song);
export type SongDocument = Song & HydratedDocument<Song>;
