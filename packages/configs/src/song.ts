import { BG_COLORS } from './colors';

export const THUMBNAIL_CONSTANTS = {
  zoomLevel: {
    min    : 1,
    max    : 5,
    default: 3
  },
  startTick: {
    default: 0
  },
  startLayer: {
    default: 0
  },
  backgroundColor: {
    default: BG_COLORS.gray.dark
  }
} as const;

export const MIMETYPE_NBS = 'application/octet-stream' as const;

export const UPLOAD_CONSTANTS = {
  file: {
    maxSize: 1024 * 1024 * 3 // 3 MB
  },

  title: {
    minLength: 3,
    maxLength: 100
  },

  description: {
    maxLength: 1000
  },

  originalAuthor: {
    maxLength: 50
  },

  category: {
    default: 'none'
  },

  license: {
    default: 'none'
  },

  customInstruments: {
    maxCount: 240
  },

  categories: {
    none        : 'No category',
    rock        : 'Rock',
    pop         : 'Pop',
    jazz        : 'Jazz',
    blues       : 'Blues',
    country     : 'Country',
    metal       : 'Metal',
    hiphop      : 'Hip-Hop',
    rap         : 'Rap',
    reggae      : 'Reggae',
    classical   : 'Classical',
    electronic  : 'Electronic',
    dance       : 'Dance',
    rnb         : 'R&B',
    soul        : 'Soul',
    funk        : 'Funk',
    punk        : 'Punk',
    alternative : 'Alternative',
    indie       : 'Indie',
    folk        : 'Folk',
    latin       : 'Latin',
    world       : 'World',
    other       : 'Other',
    vocaloid    : 'Vocaloid',
    soundtrack  : 'Soundtrack',
    instrumental: 'Instrumental',
    ambient     : 'Ambient',
    gaming      : 'Gaming',
    anime       : 'Anime',
    movies_tv   : 'Movies & TV',
    chiptune    : 'Chiptune',
    lofi        : 'Lofi',
    kpop        : 'K-pop',
    jpop        : 'J-pop'
  },

  licenses: {
    standard: {
      name     : 'Standard License',
      shortName: 'Standard License',
      description:
        "The author reserves all rights. You may not use this song without the author's permission.",
      uploadDescription:
        'You allow us to distribute your song on Note Block World. Other users can listen to it, but they cannot use the song without your permission.'
    },
    cc_by_sa: {
      name     : 'Creative Commons - Attribution-ShareAlike 4.0',
      shortName: 'CC BY-SA 4.0',
      description:
        'You can copy, modify, and distribute this song, even for commercial purposes, as long as you credit the author and provide a link to the song. If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.\n\nFor more information, please visit the [Creative Commons website](https://creativecommons.org/licenses/by-sa/4.0/).',
      uploadDescription:
        'Anyone can copy, modify, remix, adapt and distribute this song, even for commercial purposes, as long as attribution is provided and the modifications are distributed under the same license.\nFor more information, visit the [Creative Commons](https://creativecommons.org/licenses/by-sa/4.0/) website.'
    }
  },

  visibility: {
    public : 'Public',
    private: 'Private'
  }
} as const;

export const TIMESPANS = [
  'hour',
  'day',
  'week',
  'month',
  'year',
  'all'
] as const;

export const MY_SONGS = {
  PAGE_SIZE: 10,
  SORT     : 'createdAt'
} as const;

export const BROWSER_SONGS = {
  featuredPageSize      : 10,
  paddedFeaturedPageSize: 5
} as const;
