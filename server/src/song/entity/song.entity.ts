import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      // add _id as string
      ret.id = doc._id.toString();
      // hydrate uploader
      //if (ret.uploader) {
      //  ret.uploader = ret.uploader.toJSON();
      //}
    },
  },
})
export class Song {
  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  creationAt: Date;

  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  lastAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  uploader: ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  playCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  downloadCount: number;

  @Prop({
    required: true,
    default: 0,
    type: Number,
  })
  likeCount: number;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  allowDownload: boolean;

  @Prop({ type: String, required: true })
  visibility: string;

  // SONG ATTRIBUTES
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  originalAuthor: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: false })
  duration: number;

  @Prop({ type: Number, required: false })
  tempo: number;

  @Prop({ type: Number, required: false })
  noteCount: number;

  @Prop({ type: String, required: false })
  coverImageUrl: string;

  @Prop({ type: String, required: false })
  nbsFileUrl: string;

  // binary file data
  @Prop({ type: MongooseSchema.Types.Buffer, required: false })
  rawFile: Buffer;
  song: import('mongoose').Types.ObjectId;

  //@Prop({ type: Array<{id: number, event: string}> })
  //customInstruments: string;

  //const data = [{
  //  id: 0,
  //  event: "entity.fireworks.blast"
  //} ]

  /*
 Fields that probably shouldn't exist:
 - comments: Array[MongoDB]
 - nbsFile: Blob
 - content: string
     - base64-encoded binary note data
     - e.g. [0 24 36 48] -> 8a4bf48e2de27
*/
}

export const SongSchema = SchemaFactory.createForClass(Song);
export type SongDocument = Song & HydratedDocument<Song>;
