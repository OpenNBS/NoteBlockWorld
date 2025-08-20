import { readFileSync } from 'fs';
import { join, resolve } from 'path';

import { Song, fromArrayBuffer } from '@encode42/nbs.js';

export function openSongFromPath(path: string): Song {
  // Specify the relative path to the file
  const filePath = join(resolve(__dirname), path);

  // Read the file and get its array buffer
  const buffer = asArrayBuffer(readFileSync(filePath));

  const song = fromArrayBuffer(buffer);

  return song;
}

function asArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);

  for (let i = 0; i < buffer.length; ++i) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore //TODO: fix this
    view[i] = buffer[i];
  }

  return arrayBuffer;
}
