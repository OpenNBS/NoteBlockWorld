export type SongPageView = {
  // Auto-generated
  id: string;
  uploader: string;
  coverImageUrl: string;
  downloadUrl: string;
  createdAt: Date;

  // From song document update
  playCount: number;
  likeCount: number;

  // From upload form -> updates NBS file
  title: string;
  originalAuthor: string;
  description: string;

  // From upload form -> updates song document
  updatedAt: Date;
  category: string;
  visibility: 'public' | 'private';
  allowDownload: boolean;

  // From upload form -> Read/calculate from NBS file
  // (Immutable!)
  fileSize: number;
  compatible: boolean;
  midiFileName: string;
  noteCount: number;
  vanillaInstrumentCount: number;
  customInstrumentCount: number;
  tickCount: number;
  layerCount: number;
  tempo: number;
  tempoRange: number[];
  timeSignature: number;
  duration: number;
  loop: boolean;
  loopStartTick: number;
  minutesSpent: number;
};
