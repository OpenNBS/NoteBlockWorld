import { Song, fromArrayBuffer } from '@encode42/nbs.js';

import { NoteQuadTree } from './notes';
import { InstrumentArray, SongFileType } from './types';

export function parseSongFromBuffer(buffer: ArrayBuffer): SongFileType {
  console.log('parsing song');

  const song = fromArrayBuffer(buffer);

  if (song.length === 0) {
    throw new Error('Invalid song');
  }

  console.log('parsing done');

  return {
    title: song.name,
    author: song.author,
    originalAuthor: song.originalAuthor,
    description: song.description,
    arrayBuffer: buffer,
    notes: new NoteQuadTree(song),
    instruments: getInstruments(song),
  };
}

const getInstruments = (song: Song): InstrumentArray => {
  console.log(song.instruments);
  const blockCounts = getInstrumentBlockCounts(song);

  const firstCustomIndex = song.instruments.firstCustomIndex;

  const customInstruments = Object.keys(song.instruments.get)
    .map((idString) => parseInt(idString))
    .filter((id) => id >= firstCustomIndex)
    .map((id) => song.instruments.get[id]);

  return customInstruments.map((instrument, id) => {
    return {
      id: id,
      name: instrument.name || '',
      count: blockCounts[id + firstCustomIndex] || 0,
    };
  });
};

const getInstrumentBlockCounts = (song: Song) => {
  const blockCounts = Object.fromEntries(
    Object.keys(song.instruments.get).map((instrumentId) => [instrumentId, 0]),
  );

  for (const layer of song.layers) {
    for (const [_, note] of layer.notes) {
      const instrumentId = note.instrument;
      blockCounts[instrumentId]++;
    }
  }

  return blockCounts;
};
