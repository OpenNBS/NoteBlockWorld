export type SongFileType = {
  title: string;
  description: string;
  author: string;
  originalAuthor: string;
  arrayBuffer: ArrayBuffer;
  notes: NoteArray;
};

export type NoteArray = Note[];

export interface Note {
  tick: number;
  layer: number;
  key: number;
  instrument: number;
}
