export class SocialLinks {
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

export class UserProfileViewDto {
  username: string;
  publicName: string;
  profileImage: string;
  description: string;
  lastSeen: Date;
  loginCount: number;
  loginStreak: number;
  playCount: number;

  socialLinks: InstanceType<typeof SocialLinks>;

  public static fromUserDocument(user: UserProfileViewDto): UserProfileViewDto {
    return new UserProfileViewDto({
      username: user.username,
      publicName: user.publicName,
      profileImage: user.profileImage,
      description: user.description,
      lastSeen: user.lastSeen,
      loginCount: user.loginCount,
      loginStreak: user.loginStreak,
      playCount: user.playCount,
      socialLinks: user.socialLinks,
    });
  }

  constructor(partial: UserProfileViewDto) {
    Object.assign(this, partial);
  }
}

// TODO: refactor all DTOs as ...Request.dto and ...Response.dto
