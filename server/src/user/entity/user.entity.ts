import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

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
  lastSeen: Date;

  @Prop({ type: Number, required: true, default: 0 })
  loginCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  loginStreak: number;

  @Prop({ type: Number, required: true, default: 0 })
  maxLoginStreak: number;

  @Prop({ type: Number, required: true, default: 0 })
  playCount: number;

  @Prop({ type: String, required: true, index: true })
  username: string;

  @Prop({ type: String, required: true, default: '#', index: true })
  publicName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, default: '#' })
  description: string;

  @Prop({ type: String, required: true, default: '#' })
  profileImage: string;

  @Prop({ type: Map, of: String, required: false, default: {} })
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
    youtube?: string;
  };

  @Prop({ type: Boolean, required: true, default: true })
  prefersDarkTheme: boolean;

  createdAt: Date; // Added automatically by Mongoose: https://mongoosejs.com/docs/timestamps.html
  updatedAt: Date; // Added automatically by Mongoose: https://mongoosejs.com/docs/timestamps.html
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & HydratedDocument<User>;
