import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDocument } from '../../user/entity/user.entity';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema()
class Song {
  @Prop({ type: Date, required: true })
  uploadDate: Date;

  @Prop({ type: String, required: true })
  uploader: HydratedDocument<UserDocument>;

  @Prop({ type: Number, required: true })
  playCount: number;

  @Prop({ type: Number, required: true })
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

  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: Number, required: true })
  tempo: number;

  @Prop({ type: Number, required: true })
  noteCount: number;

  @Prop({ type: String, required: true })
  coverImageUrl: string;

  @Prop({ type: String, required: true })
  nbsFileUrl: string;

  // binary file data
  @Prop({ type: MongooseSchema.Types.Buffer, required: true })
  content: Buffer;

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
