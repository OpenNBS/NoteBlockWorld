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
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  id: string;
};

// TODO: make this a DTO (part of the validation module)
