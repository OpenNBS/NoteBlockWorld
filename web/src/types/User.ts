export type UserTokenData = {
  id: string;
  email: string;
  username: string;
};

export type LoggedUserData = {
  loginStreak: number;
  loginCount: number;
  playCount: number;
  username: string;
  publicName: string;
  email: string;
  description: string;
  profileImage: string;
  socialLinks: SocialLinks;
  prefersDarkTheme: boolean;
  creationDate: string;
  lastEdited: string;
  lastLogin: string;
  likedSongs: string[]; // Assuming the array contains strings
  following: string[]; // Assuming the array contains strings
  likedComments: string[]; // Assuming the array contains strings
  dislikedComments: string[]; // Assuming the array contains strings
  notifications: string[]; // Assuming the array contains strings
  achievements: string[]; // Assuming the array contains strings
  createdAt: string;
  updatedAt: string;
  id: string;
};

export enum SocialLinksTypes {
  BANDCAMP = 'bandcamp',
  DISCORD = 'discord',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  INSTAGRAM = 'instagram',
  REDDIT = 'reddit',
  SNAPCHAT = 'snapchat',
  SOUNDCLOUD = 'soundcloud',
  SPOTIFY = 'spotify',
  STEAM = 'steam',
  TELEGRAM = 'telegram',
  TIKTOK = 'tiktok',
  THREADS = 'threads',
  TWITCH = 'twitch',
  X = 'x',
  YOUTUBE = 'youtube',
}

export type SocialLinks = {
  [K in SocialLinksTypes]?: string;
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
