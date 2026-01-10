import { NoteQuadTree } from './notes';

export type SongFileType = {
  title: string;
  description: string;
  author: string;
  originalAuthor: string;
  length: number;
  height: number;
  arrayBuffer: ArrayBuffer;
  notes: NoteQuadTree;
  instruments: InstrumentArray;
};

export type InstrumentArray = Instrument[];

export type Note = {
  tick: number;
  layer: number;
  key: number;
  instrument: number;
};

export type Instrument = {
  id: number;
  name: string;
  file: string;
  count: number;
};

// Type definition matching SongStats from @nbw/database
// Defined here to avoid pulling in backend dependencies
export type SongStatsType = {
  midiFileName: string;
  noteCount: number;
  tickCount: number;
  layerCount: number;
  tempo: number;
  tempoRange: number[] | null;
  timeSignature: number;
  duration: number;
  loop: boolean;
  loopStartTick: number;
  minutesSpent: number;
  vanillaInstrumentCount: number;
  customInstrumentCount: number;
  firstCustomInstrumentIndex: number;
  outOfRangeNoteCount: number;
  detunedNoteCount: number;
  customInstrumentNoteCount: number;
  incompatibleNoteCount: number;
  compatible: boolean;
  instrumentNoteCounts: number[];
};
