import { Song, fromArrayBuffer } from '@encode42/nbs.js';

import { NoteQuadTree } from './notes';
import { InstrumentArray, SongFileType } from './types';

export function parseSongFromBuffer(buffer: ArrayBuffer): SongFileType {
  const song = fromArrayBuffer(buffer);

  if (song.length === 0) {
    throw new Error('Invalid song');
  }

  const quadTree = new NoteQuadTree(song);

  return {
    title: song.meta.name,
    author: song.meta.author,
    originalAuthor: song.meta.originalAuthor,
    description: song.meta.description,
    length: quadTree.width,
    height: quadTree.height,
    arrayBuffer: buffer,
    notes: quadTree,
    instruments: getInstruments(song),
  };
}

const getInstruments = (song: Song): InstrumentArray => {
  const blockCounts = getInstrumentBlockCounts(song);

  const firstCustomIndex = song.instruments.firstCustomIndex;

  const customInstruments = song.instruments.loaded.filter(
    (instrument) => instrument.builtIn === false,
  );

  return customInstruments.map((instrument, id) => {
    return {
      id: id,
      name: instrument.meta.name || '',
      count: blockCounts[id + firstCustomIndex] || 0,
    };
  });
};

export const getInstrumentBlockCounts = (song: Song) => {
  const blockCounts = Object.fromEntries(
    Object.keys(song.instruments.loaded).map((instrumentId) => [
      instrumentId,
      0,
    ]),
  );

  for (const layer of song.layers) {
    for (const tick in layer.notes) {
      const note = layer.notes[tick];
      const instrumentId = note.instrument;
      blockCounts[instrumentId]++;
    }
  }

  return blockCounts;
};
