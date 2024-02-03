export type CoverData = {
  zoomLevel: number;
  startTick: number;
  startLayer: number;
  backgroundColor: string;
};

export type UploadSongForm = {
  allowDownload: boolean;
  visibility: 'public' | 'private'; // Use a string literal type if the visibility can only be 'public' or 'private'
  title: string;
  originalAuthor: string;
  description: string;
  coverData: CoverData;
  customInstruments: string[];
  license: 'no_license' | 'cc_by_4' | 'public_domain';
  tags: string;
  category:
    | 'Gaming'
    | 'MoviesNTV'
    | 'Anime'
    | 'Vocaloid'
    | 'Rock'
    | 'Pop'
    | 'Electronic'
    | 'Ambient'
    | 'Jazz'
    | 'Classical';
};
