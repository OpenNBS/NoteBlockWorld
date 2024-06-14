import { Song, fromArrayBuffer } from '@encode42/nbs.js';

export function parseSongFromBuffer(buffer: ArrayBuffer): Song {
  const song = fromArrayBuffer(buffer);

  return song;
}
