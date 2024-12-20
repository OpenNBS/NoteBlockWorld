import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema({})
class SocialLinks {
  bandcamp?: string;
  discord?: string;
  facebook?: string;
  github?: string;
  instagram?: string;
  reddit?: string;
  snapchat?: string;
  soundcloud?: string;
  spotify?: string;
  steam?: string;
  telegram?: string;
  tiktok?: string;
  threads?: string;
  twitch?: string;
  x?: string;
  youtube?: string;
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class User {
  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  creationDate: Date;

  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  lastEdited: Date;

  @Prop({ type: MongooseSchema.Types.Date, required: true, default: Date.now })
  lastLogin: Date;

  @Prop({ type: Number, required: true, default: 0 })
  loginStreak: number;

  @Prop({ type: Number, required: true, default: 0 })
  loginCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  playCount: number;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true, default: '#' })
  publicName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, default: 'no password' })
  password: string;

  @Prop({ type: String, required: true, default: '#' })
  description: string;

  @Prop({ type: String, required: true, default: '#' })
  profileImage: string;

  @Prop({ type: SocialLinks, required: false, default: {} })
  socialLinks: SocialLinks;

  @Prop({ type: Boolean, required: true, default: true })
  prefersDarkTheme: boolean;

  @Prop({ type: Array, required: true, default: [] })
  likedSongs: string[];

  @Prop({ type: Array, required: true, default: [] })
  following: string[];

  @Prop({ type: Array, required: true, default: [] })
  likedComments: string[];

  @Prop({ type: Array, required: true, default: [] })
  dislikedComments: string[];

  @Prop({ type: Array, required: true, default: [] })
  notifications: string[];

  @Prop({ type: Array, required: true, default: [] })
  achievements: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & HydratedDocument<User>;
