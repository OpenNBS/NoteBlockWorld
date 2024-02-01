type Email = {
  value: string;
  verified: boolean;
};

type Photo = {
  value: string;
};

type ProfileJson = {
  sub: string;
  name: string;
  given_name: string;
  family_name?: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

// TODO: this is a uniform profile type standardized by passport for all providers
export type Profile = {
  id: string;
  displayName: string;
  name: {
    familyName?: string;
    givenName: string;
  };
  emails: Email[];
  photos: Photo[];
  provider: string;
  _raw: string;
  _json: ProfileJson;
};
