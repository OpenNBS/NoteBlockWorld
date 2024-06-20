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
  count: number;
};

export type SongStatsType = {
  fileSize: number;
  midiFileName: string;
  noteCount: number;
  tickCount: number;
  layerCount: number;
  tempo: number;
  tempoRange: number[];
  timeSignature: number;
  duration: number;
  loop: boolean;
  loopStartTick: number;
  minutesSpent: number;
  usesCustomInstruments: boolean;
  isInOctaveRange: boolean;
  compatible: boolean;
  instrumentCounts: number[];
};
