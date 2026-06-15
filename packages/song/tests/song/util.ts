import { readFileSync } from 'fs';
import { join, resolve } from 'path';

import type { Song } from '@encode42/nbs.js';

import { loadNbsFromBuffer } from '../../src/nbsCompat';

export function openSongFromPath(path: string): Song {
  // Specify the relative path to the file
  const filePath = join(resolve(__dirname), path);

  // Read the file and get its array buffer
  const buffer = asArrayBuffer(readFileSync(filePath));

  return loadNbsFromBuffer(buffer);
}

export function asArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);

  for (let i = 0; i < buffer.length; ++i) {
    // @ts-ignore //TODO: fix this
    view[i] = buffer[i];
  }

  return arrayBuffer;
}
