import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({})
class SocialLinks {
  bandcamp?  : string;
  discord?   : string;
  facebook?  : string;
  github?    : string;
  instagram? : string;
  reddit?    : string;
  snapchat?  : string;
  soundcloud?: string;
  spotify?   : string;
  steam?     : string;
  telegram?  : string;
  tiktok?    : string;
  threads?   : string;
  twitch?    : string;
  x?         : string;
  youtube?   : string;
}

@Schema({
  timestamps: true,
  toJSON    : {
    virtuals : true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    }
  }
})
export class User {
  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  creationDate: Date;

  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  lastEdited: Date;

  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  lastSeen: Date;

  @Prop({ type: Number, required: true, default: 0 })
  loginCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  loginStreak: number;

  @Prop({ type: Number, required: true, default: 0 })
  maxLoginStreak: number;

  @Prop({ type: Number, required: true, default: 0 })
  playCount: number;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true, default: '#' })
  publicName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: false, default: null })
  singleUsePass?: string;

  @Prop({ type: String, required: false, default: null })
  singleUsePassID?: string;

  @Prop({ type: String, required: true, default: 'No description provided' })
  description: string;

  @Prop({
    type    : String,
    required: true,
    default : '/img/note-block-pfp.jpg'
  })
  profileImage: string;

  @Prop({ type: SocialLinks, required: false, default: {} })
  socialLinks: SocialLinks;

  @Prop({ type: Boolean, required: true, default: true })
  prefersDarkTheme: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & HydratedDocument<User>;
