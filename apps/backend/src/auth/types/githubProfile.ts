type Email = {
  value: string;
};

type Photo = {
  value: string;
};

type ProfileJson = {
  login              : string;
  id                 : number;
  node_id            : string;
  avatar_url         : string;
  gravatar_id        : string;
  url                : string;
  html_url           : string;
  followers_url      : string;
  following_url      : string;
  gists_url          : string;
  starred_url        : string;
  subscriptions_url  : string;
  organizations_url  : string;
  repos_url          : string;
  events_url         : string;
  received_events_url: string;
  type               : string;
  site_admin         : boolean;
  name               : string;
  company            : string;
  blog               : string;
  location           : string;
  email              : string;
  hireable           : boolean;
  bio                : string;
  twitter_username   : string;
  public_repos       : number;
  public_gists       : number;
  followers          : number;
  following          : number;
  created_at         : string;
  updated_at         : string;
};

type Profile = {
  id         : string;
  displayName: string;
  username   : string;
  profileUrl : string;
  emails     : Email[];
  photos     : Photo[];
  provider   : string;
  _raw       : string;
  _json      : ProfileJson;
};

export type GithubAccessToken = {
  accessToken: string;
  profile    : Profile;
};

export type GithubEmailList = Array<{
  email     : string;
  primary   : string;
  visibility: string;
}>;
