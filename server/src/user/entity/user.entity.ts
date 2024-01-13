import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
class User {
  @Prop({ type: Date, required: true })
  creationDate: Date;

  @Prop({ type: Date, required: true })
  lastEdited: Date;

  @Prop({ type: Date, required: true })
  lastLogin: Date;

  @Prop({ type: Number, required: true })
  loginStreak: number;

  @Prop({ type: Number, required: true })
  loginCount: number;

  @Prop({ type: Number, required: true })
  playCount: number;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  publicName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  profileImage: string;

  @Prop({ type: Map, of: String, required: false })
  socialLinks: {
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
    youube?: string;
  };

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
