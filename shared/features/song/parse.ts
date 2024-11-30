import { Song, fromArrayBuffer } from '@encode42/nbs.js';

import { NoteQuadTree } from './notes';
import { InstrumentArray, SongFileType } from './types';
import { getInstrumentNoteCounts } from './util';

async function getVanillaSoundList() {
  // Object that maps sound paths to their respective hashes

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/data/soundList.json',
  );

  const soundsMapping = (await response.json()) as Record<string, string>;
  const vanillaSoundList = Object.keys(soundsMapping);

  return vanillaSoundList;
}

export async function parseSongFromBuffer(
  buffer: ArrayBuffer,
): Promise<SongFileType> {
  const song = fromArrayBuffer(buffer);

  if (song.length === 0) {
    throw new Error('Invalid song');
  }

  const quadTree = new NoteQuadTree(song);

  const vanillaSoundList = await getVanillaSoundList();

  return {
    title: song.meta.name,
    author: song.meta.author,
    originalAuthor: song.meta.originalAuthor,
    description: song.meta.description,
    length: quadTree.width,
    height: quadTree.height,
    arrayBuffer: buffer,
    notes: quadTree,
    instruments: getInstruments(song, vanillaSoundList),
  };
}

const getInstruments = (
  song: Song,
  vanillaSoundList: string[],
): InstrumentArray => {
  const blockCounts = getInstrumentNoteCounts(song);

  const firstCustomIndex = song.instruments.firstCustomIndex;

  const customInstruments = song.instruments.loaded.filter(
    (instrument) => instrument.builtIn === false,
  );

  return customInstruments.map((instrument, id) => {
    let soundFile = '';

    const fullSoundPath = instrument.meta.soundFile.replace(
      'minecraft/',
      'minecraft/sounds/',
    );

    if (vanillaSoundList.includes(fullSoundPath)) {
      soundFile = fullSoundPath;
    }

    return {
      id: id,
      name: instrument.meta.name || '',
      file: soundFile,
      count: blockCounts[id + firstCustomIndex] || 0,
    };
  });
};
