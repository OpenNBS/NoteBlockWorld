type SocialLinks = {
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

export type UserProfileData = {
  lastLogin: Date;
  loginStreak: number;
  playCount: number;
  publicName: string;
  description: string;
  profileImage: string;
  socialLinks: SocialLinks;
  likedSongs: string[];
  following: string[];
  achievements: string[];
};
