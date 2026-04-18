import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
class ProfileSocialLinks {
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
export class Profile {
  /** One Profile per User (unique index). */
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true, default: '' })
  description: string;

  @Prop({ type: ProfileSocialLinks, required: false, default: {} })
  socialLinks: ProfileSocialLinks;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

export type ProfileDocument = Profile & Document;
