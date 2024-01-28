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
