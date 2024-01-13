import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SongDocument } from '@server/song/entity/song.entity';
import { UserDocument } from '@server/user/entity/user.entity';
import { HydratedDocument } from 'mongoose';

@Schema()
class Playlist {
  @Prop({ type: Date, required: true })
  creationDate: Date;

  @Prop({ type: Date, required: true })
  lastEdited: Date;

  @Prop({ type: String, required: true })
  author: HydratedDocument<UserDocument>;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Boolean, required: true })
  public: boolean;

  @Prop({ type: Array, required: true })
  songs: SongDocument[];

  @Prop({ type: Array, required: true })
  likedBy: string[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
export type PlaylistDocument = Playlist & Document;
