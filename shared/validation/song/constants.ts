import { bgColors } from '@shared/features/thumbnail/colors';

import { deepFreeze } from '../common/deepFreeze';

export const ThumbnailConst = deepFreeze({
  zoomLevel: {
    min: 1,
    max: 5,
    default: 3,
  },
  startTick: {
    default: 0,
  },
  startLayer: {
    default: 0,
  },
  backgroundColor: {
    default: bgColors.gray.dark,
  },
});

export const MIMETYPE_NBS = 'application/octet-stream';

export const UploadConst = deepFreeze({
  file: {
    maxSize: 1024 * 1024, // 1 MB
  },

  title: {
    minLength: 3,
    maxLength: 100,
  },

  description: {
    maxLength: 1000,
  },

  originalAuthor: {
    maxLength: 50,
  },

  category: {
    default: 'none',
  },

  license: {
    default: 'cc_by',
  },

  customInstruments: {
    maxCount: 240,
  },

  categories: {
    none: 'No category',
    rock: 'Rock',
    pop: 'Pop',
    jazz: 'Jazz',
    blues: 'Blues',
    country: 'Country',
    metal: 'Metal',
    hiphop: 'Hip-Hop',
    rap: 'Rap',
    reggae: 'Reggae',
    classical: 'Classical',
    electronic: 'Electronic',
    dance: 'Dance',
    rnb: 'R&B',
    soul: 'Soul',
    funk: 'Funk',
    punk: 'Punk',
    alternative: 'Alternative',
    indie: 'Indie',
    folk: 'Folk',
    latin: 'Latin',
    world: 'World',
    other: 'Other',
    vocaloid: 'Vocaloid',
    soundtrack: 'Soundtrack',
    instrumental: 'Instrumental',
    ambient: 'Ambient',
    gaming: 'Gaming',
    anime: 'Anime',
    movies_tv: 'Movies & TV',
    chiptune: 'Chiptune',
    lofi: 'Lofi',
    kpop: 'K-pop',
    jpop: 'J-pop',
  },

  licenses: {
    all_rights_reserved: 'All Rights Reserved',
    cc_by: 'CC BY',
    cc_by_sa: 'CC BY-SA',
    cc_by_nd: 'CC BY-ND',
    cc_by_nc: 'CC BY-NC',
    cc_by_nc_sa: 'CC BY-NC-SA',
    cc_by_nc_nd: 'CC BY-NC-ND',
    public_domain: 'Public Domain',
    unknown: 'Unknown',
  },

  visibility: {
    public: 'Public',
    private: 'Private',
  },
});

export const timespans = [
  'hour',
  'day',
  'week',
  'month',
  'year',
  'all',
] as const;

export const MY_SONGS = deepFreeze({
  PAGE_SIZE: 10,
  SORT: 'createdAt',
});

export const BROWSER_SONGS = deepFreeze({
  max_recent_songs: 100,
  featuredPageSize: 10,
});
