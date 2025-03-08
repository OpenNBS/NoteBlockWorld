import { UserDocument } from '@server/user/entity/user.entity';

export class UserProfileViewDto {
  username: string;
  publicName: string;
  profileImage: string;
  description: string;
  lastSeen: Date;
  loginCount: number;
  loginStreak: number;
  playCount: number;
  // socialLinks: Record<keyof typeof UserLinks, string | undefined>;

  public static fromUserDocument(user: UserDocument): UserProfileViewDto {
    return new UserProfileViewDto({
      username: user.username,
      publicName: user.publicName,
      profileImage: user.profileImage,
      description: user.description,
      lastSeen: user.lastSeen,
      loginCount: user.loginCount,
      loginStreak: user.loginStreak,
      playCount: user.playCount,
      // socialLinks: user.socialLinks,
    });
  }

  constructor(partial: UserProfileViewDto) {
    Object.assign(this, partial);
  }
}

// TODO: refactor all DTOs as ...Request.dto and ...Response.dto
