import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Profile, ProfileDocument, UserDocument } from '@nbw/database';
import type { PatchProfileBody, PublicProfileDto } from '@nbw/validation';
import { UserService } from '@server/user/user.service';

/** Matches `SocialLinks` in user/profile entities — excludes Mongoose `_id` on embedded docs. */
const PUBLIC_SOCIAL_KEYS = [
  'bandcamp',
  'discord',
  'facebook',
  'github',
  'instagram',
  'reddit',
  'snapchat',
  'soundcloud',
  'spotify',
  'steam',
  'telegram',
  'tiktok',
  'threads',
  'twitch',
  'x',
  'youtube',
] as const;

export function mergeSocialLinks(
  userLinks: Record<string, string | undefined> | undefined,
  profileLinks: Record<string, string | undefined> | undefined,
): Record<string, string | undefined> {
  return {
    ...(userLinks ?? {}),
    ...(profileLinks ?? {}),
  };
}

/** Strip Mongo subdocument fields (e.g. `_id`) and unknown keys from API output. */
export function sanitizeSocialLinksForPublic(
  raw: Record<string, unknown> | null | undefined,
): Record<string, string | undefined> {
  if (!raw || typeof raw !== 'object') {
    return {};
  }
  const out: Record<string, string | undefined> = {};
  for (const key of PUBLIC_SOCIAL_KEYS) {
    const v = raw[key];
    if (typeof v === 'string' && v.trim() !== '') {
      out[key] = v;
    }
  }
  return out;
}

export function toPublicProfileDto(
  user: UserDocument,
  profile: ProfileDocument | null,
): PublicProfileDto {
  const description = profile !== null ? profile.description : user.description;

  const merged =
    profile !== null
      ? mergeSocialLinks(
          user.socialLinks as Record<string, string | undefined>,
          profile.socialLinks as Record<string, string | undefined>,
        )
      : (user.socialLinks as Record<string, string | undefined>);

  const socialLinks = sanitizeSocialLinksForPublic(
    merged as Record<string, unknown>,
  );

  return {
    id: user._id.toString(),
    username: user.username,
    publicName: user.publicName,
    profileImage: user.profileImage,
    description,
    socialLinks,
  };
}

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    private readonly userService: UserService,
  ) {}

  public async getMergedPublicProfile(
    userId: string,
  ): Promise<PublicProfileDto> {
    const user = await this.userService.findByID(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const profile = await this.profileModel.findOne({ user: user._id }).exec();

    return toPublicProfileDto(user, profile);
  }

  /**
   * Public profile by URL username segment (same normalization as registration).
   * One User maps to at most one Profile document (enforced by unique index on `Profile.user`).
   */
  public async getMergedPublicProfileByUsername(
    rawUsername: string,
  ): Promise<PublicProfileDto> {
    const normalized = this.userService.normalizeUsername(rawUsername);
    const user = await this.userService.findByUsername(normalized);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const profile = await this.profileModel.findOne({ user: user._id }).exec();

    return toPublicProfileDto(user, profile);
  }

  public async patchProfile(
    requester: UserDocument,
    body: PatchProfileBody,
  ): Promise<PublicProfileDto> {
    let user = await this.userService.findByID(requester._id.toString());

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (
      body.description === undefined &&
      body.socialLinks === undefined &&
      body.publicName === undefined
    ) {
      const profile = await this.profileModel
        .findOne({ user: requester._id })
        .exec();
      return toPublicProfileDto(user, profile);
    }

    if (body.publicName !== undefined) {
      user.publicName = body.publicName;
      user = (await this.userService.update(user)) as UserDocument;
    }

    if (body.description !== undefined || body.socialLinks !== undefined) {
      let profile = await this.profileModel
        .findOne({ user: requester._id })
        .exec();

      if (!profile) {
        profile = await this.profileModel.create({
          user: requester._id as Types.ObjectId,
          description: body.description ?? '',
          socialLinks: (body.socialLinks ?? {}) as Profile['socialLinks'],
        });
      } else {
        if (body.description !== undefined) {
          profile.description = body.description;
        }
        if (body.socialLinks !== undefined) {
          profile.socialLinks = mergeSocialLinks(
            profile.socialLinks as Record<string, string | undefined>,
            body.socialLinks as Record<string, string | undefined>,
          ) as Profile['socialLinks'];
        }
        await profile.save();
      }
    }

    const profileDoc = await this.profileModel
      .findOne({ user: requester._id })
      .exec();

    return toPublicProfileDto(user, profileDoc);
  }
}
