function deepFreeze<T extends { [key: string]: any }>(object: T): Readonly<T> {
  const propNames = Object.getOwnPropertyNames(object);

  for (const name of propNames) {
    const value = object[name];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    object[name] =
      value && typeof value === 'object' ? deepFreeze(value) : value;
  }

  return Object.freeze(object);
}

export const ThumbnailConst = deepFreeze({
  MIN_ZOOM_LEVEL: 1,
  MAX_ZOOM_LEVEL: 5,
  DEFAULT_ZOOM_LEVEL: 3,
  DEFAULT_START_TICK: 0,
  DEFAULT_START_LAYER: 0,
});

export const ThumbnailBgColors = deepFreeze({
  red: { name: 'Red', light: '#FFCDD2', dark: '#E57373' },
  pink: { name: 'Pink', light: '#F8BBD0', dark: '#F06292' },
  purple: { name: 'Purple', light: '#E1BEE7', dark: '#BA68C8' },
  deepPurple: { name: 'Deep Purple', light: '#D1C4E9', dark: '#9575CD' },
  indigo: { name: 'Indigo', light: '#C5CAE9', dark: '#7986CB' },
  blue: { name: 'Blue', light: '#BBDEFB', dark: '#64B5F6' },
  lightBlue: { name: 'Light Blue', light: '#B3E5FC', dark: '#4FC3F7' },
  cyan: { name: 'Cyan', light: '#B2EBF2', dark: '#4DD0E1' },
  teal: { name: 'Teal', light: '#B2DFDB', dark: '#4DB6AC' },
  green: { name: 'Green', light: '#C8E6C9', dark: '#81C784' },
  lightGreen: { name: 'Light Green', light: '#DCEDC8', dark: '#AED581' },
  lime: { name: 'Lime', light: '#F0F4C3', dark: '#DCE775' },
  yellow: { name: 'Yellow', light: '#FFF9C4', dark: '#FFF176' },
  amber: { name: 'Amber', light: '#FFECB3', dark: '#FFD54F' },
  orange: { name: 'Orange', light: '#FFE0B2', dark: '#FFB74D' },
  deepOrange: { name: 'Deep Orange', light: '#FFCCBC', dark: '#FF8A65' },
  brown: { name: 'Brown', light: '#D7CCC8', dark: '#A1887F' },
  gray: { name: 'Gray', light: '#CFD8DC', dark: '#90A4AE' },
});

export const UploadConst = deepFreeze({
  MAX_SONG_UPLOAD_SIZE: 1024 * 1024, // 1 MB
  MIMETYPE_NBS: 'application/octet-stream',
  MAX_SONG_TITLE_LENGTH: 100,
  MAX_SONG_DESCRIPTION_LENGTH: 1000,
  MAX_SONG_ORIGINAL_AUTHOR_LENGTH: 50,
  categories: {
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