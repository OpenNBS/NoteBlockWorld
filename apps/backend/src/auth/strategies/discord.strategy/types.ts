import passport from 'passport';

/**
 * https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
 */
export enum DiscordPermissionScope {
  ActivitiesRead = 'activities.read',
  ActivitiesWrite = 'activities.write',
  ApplicationBuildsRead = 'applications.builds.read',
  ApplicationBuildsUpload = 'applications.builds.upload',
  ApplicationsCommands = 'applications.commands',
  ApplicationsCommandsUpdate = 'applications.commands.update',
  ApplicationsCommandsPermissionsUpdate = 'applications.commands.permissions.update',
  ApplicationsEntitlements = 'applications.entitlements',
  ApplicationsStoreUpdate = 'applications.store.update',
  Bot = 'bot',
  Connections = 'connections',
  DmRead = 'dm_channels.read',
  Email = 'email',
  GdmJoin = 'gdm.join',
  Guilds = 'guilds',
  GuildsJoin = 'guilds.join',
  GuildMembersRead = 'guilds.members.read',
  Identify = 'identify',
  MessagesRead = 'messages.read',
  RelationshipsRead = 'relationships.read',
  RoleConnectionsWrite = 'role_connections.write',
  Rpc = 'rpc',
  RpcActivitiesUpdate = 'rpc.activities.update',
  RpcNotificationsRead = 'rpc.notifications.read',
  RpcVoiceRead = 'rpc.voice.read',
  RpcVoiceWrite = 'rpc.voice.write',
  Voice = 'voice',
  WebhookIncoming = 'webhook.incoming'
}

export type SingleScopeType = `${DiscordPermissionScope}`;

export type ScopeType = SingleScopeType[];

/**
 *  https://discord.com/developers/docs/resources/user#user-object
 */
export interface DiscordUser {
  id                     : string;
  username               : string;
  global_name?           : string | undefined;
  avatar                 : string;
  bot?                   : string | undefined;
  system?                : boolean | undefined;
  mfa_enabled?           : boolean | undefined;
  banner?                : string | undefined;
  accent_color?          : number | undefined;
  locale?                : string | undefined;
  verified?              : boolean | undefined;
  email?                 : string | undefined;
  flags?                 : number | undefined;
  premium_type?          : number | undefined;
  public_flags?          : number | undefined;
  avatar_decoration_data?: AvatarDecorationData | undefined;
}

export interface AvatarDecorationData {
  asset : string;
  sku_id: string;
}

export interface DiscordAccount {
  id  : string;
  name: string;
}

export interface DiscordApplication {
  id         : string;
  name       : string;
  icon?      : string | undefined;
  description: string;
  bot?       : DiscordUser;
}

export interface DiscordIntegration {
  id                  : string;
  name                : string;
  type                : string;
  enabled             : boolean;
  syncing?            : boolean | undefined;
  role_id?            : string | undefined;
  enable_emoticons?   : boolean | undefined;
  expire_behavior?    : number | undefined;
  expire_grace_period?: number | undefined;
  user?               : DiscordUser | undefined;
  account             : DiscordAccount;
  synced_at?          : Date | undefined;
  subscriber_count?   : number | undefined;
  revoked?            : boolean | undefined;
  application?        : DiscordApplication | undefined;
  scopes?             : ScopeType | undefined;
}

export interface ProfileConnection {
  id           : string;
  name         : string;
  type         : string;
  revoked?     : boolean | undefined;
  integrations?: DiscordIntegration[] | undefined;
  verified     : boolean;
  friend_sync  : boolean;
  show_activity: boolean;
  two_way_link : boolean;
  visibility   : number;
}

export interface DiscordRoleTag {
  bot_id?                 : string | undefined;
  integration_id?         : string | undefined;
  premium_subscriber?     : null | undefined;
  subscription_listing_id?: string | undefined;
  available_for_purchase? : null | undefined;
  guild_connections?      : null | undefined;
}

export interface DiscordRole {
  id            : string;
  name          : string;
  color         : number;
  hoist         : boolean;
  icon?         : string | undefined;
  unicode_emoji?: string | undefined;
  position      : number;
  permissions   : string;
  managed       : boolean;
  tags?         : DiscordRoleTag | undefined;
  flags         : number;
}

export interface DiscordEmoji {
  id?            : string | undefined;
  name           : string | undefined;
  roles?         : string[];
  user?          : DiscordUser;
  require_colons?: boolean | undefined;
  managed?       : boolean | undefined;
  animated?      : boolean | undefined;
  available?     : boolean | undefined;
}

export interface DiscordWelcomeScreenChannel {
  channel_id : string;
  description: string;
  emoji_id?  : string | undefined;
  emoji_name?: string | undefined;
}

export interface DiscordWelcomeScreen {
  description?    : string | undefined;
  welcome_channels: DiscordWelcomeScreenChannel[];
}

export interface DiscordSticker {
  id         : string;
  pack_id?   : string | undefined;
  name       : string;
  description: string;
  tags       : string;
  type       : number;
  format_type: number;
  available? : boolean | undefined;
  guild_id?  : string | undefined;
  user?      : DiscordUser | undefined;
  sort_value?: number | undefined;
}

export interface ProfileGuild {
  id                            : string;
  name                          : string;
  icon?                         : string | undefined;
  icon_hash?                    : string | undefined;
  splash?                       : string | undefined;
  discovery_splash?             : string | undefined;
  owner?                        : boolean | string;
  owner_id                      : string;
  permissions?                  : string | undefined;
  afk_channel_id?               : string | undefined;
  afk_timeout?                  : number | undefined;
  widget_enabled                : boolean | undefined;
  widget_channel_id?            : string | undefined;
  verification_level?           : number | undefined;
  default_message_notifications?: number | undefined;
  explicit_content_filter?      : number | undefined;
  roles                         : DiscordRole[];
  emojis                        : DiscordEmoji[];
  features                      : string[];
  mfa_level?                    : number | undefined;
  application_id?               : string | undefined;
  system_channel_id?            : string | undefined;
  system_channel_flags?         : number | undefined;
  rules_channel_id?             : string | undefined;
  max_presences?                : number | undefined;
  max_members?                  : number | undefined;
  vanity_url_code?              : string | undefined;
  description?                  : string | undefined;
  banner?                       : string | undefined;
  premium_tier?                 : number | undefined;
  premium_subscription_count?   : number | undefined;
  preferred_locale?             : string | undefined;
  public_updates_channel_id?    : string | undefined;
  max_video_channel_users?      : number | undefined;
  max_stage_video_channel_users?: number | undefined;
  approximate_member_count?     : number | undefined;
  approximate_presence_count?   : number | undefined;
  welcome_screen?               : DiscordWelcomeScreen | undefined;
  nsfw_level?                   : number | undefined;
  stickers?                     : DiscordSticker[] | undefined;
  premium_progress_bar_enabled? : boolean | undefined;
  safety_alerts_channel_id?     : string | undefined;
}

export interface Profile
  extends Omit<passport.Profile, 'username'>,
    DiscordUser {
  provider    : string;
  connections?: ProfileConnection[] | undefined;
  guilds?     : ProfileGuild[] | undefined;
  access_token: string;
  fetchedAt   : Date;
  createdAt   : Date;
  _raw        : unknown;
  _json       : Record<string, unknown>;
}
