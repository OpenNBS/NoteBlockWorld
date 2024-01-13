import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from '../../user/entity/user.entity';
import { SongDocument } from '../../song/entity/song.entity';

@Schema()
class Comment {
  @Prop({ type: Date, required: true })
  creationDate: Date;

  @Prop({ type: String, required: true })
  rootCommentId: string;

  @Prop({ type: String, required: true })
  author: HydratedDocument<UserDocument>;

  @Prop({ type: String, required: true })
  song: HydratedDocument<SongDocument>;

  @Prop({ type: String, required: true })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export type CommentDocument = Comment & Document;
