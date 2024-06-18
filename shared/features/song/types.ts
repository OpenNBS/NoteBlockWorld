export type SongFileType = {
  title: string;
  description: string;
  author: string;
  originalAuthor: string;
  arrayBuffer: ArrayBuffer;
  notes: NoteArray;
};

export type NoteArray = (Note | null)[][];

export interface Note {
  key: number;
  instrument: number;
}
