export type SongFileType = {
  title: string;
  description: string;
  author: string;
  originalAuthor: string;
  arrayBuffer: ArrayBuffer;
  notes: NoteArray;
  instruments: InstrumentArray;
};

export type NoteArray = Note[];

export type InstrumentArray = Instrument[];

export interface Note {
  tick: number;
  layer: number;
  key: number;
  instrument: number;
}

export interface Instrument {
  id: number;
  name: string;
  count: number;
}
