import { Song, fromArrayBuffer, toArrayBuffer } from '@encode42/nbs.js';

import { NoteArray, SongFileType } from './types';

export function parseSongFromBuffer(buffer: ArrayBuffer): SongFileType {
  const song = fromArrayBuffer(buffer);

  if (song.length === 0) {
    throw new Error('Invalid song');
  }

  return {
    title: song.name,
    author: song.author,
    originalAuthor: song.originalAuthor,
    description: song.description,
    arrayBuffer: toArrayBuffer(song),
    notes: getNoteArray(song),
  };
}

const getNoteArray = (song: Song): NoteArray => {
  const notes: NoteArray = [];

  for (const [layerId, layer] of song.layers.get.entries()) {
    for (const [tick, note] of layer.notes) {
      const noteData = {
        tick: tick,
        layer: layerId,
        key: note.key,
        instrument: note.instrument,
      };

      notes.push(noteData);
    }
  }

  console.log(notes);

  return notes;
};
