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
