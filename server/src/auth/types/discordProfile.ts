export type DiscordUser = {
  access_token: string;
  refresh_token: string;
  profile: DiscordProfile;
};

export type DiscordProfile = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string;
  accent_color: string;
  global_name: string;
  avatar_decoration_data: string | null;
  banner_color: string | null;
  clan: string | null;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
  email: string;
  verified: boolean;
  provider: string;
  accessToken: string;
  fetchedAt: string;
};
