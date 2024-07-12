import { Song } from '@encode42/nbs.js';
import * as JSZip from 'jszip';

import { SongObfuscator } from './obfuscate';

export async function obfuscateAndPackSong(
  nbsSong: Song,
  soundsArray: string[],
  soundsMapping: Record<string, string>,
) {
  // Create a ZIP file with the obfuscated song in the root as 'song.nbs'
  // and the sounds in a 'sounds' folder. Return the ZIP file as a buffer.

  // Import JSZip as a CommonJS module
  // (see: https://github.com/Stuk/jszip/issues/890)

  // Create a new empty ZIP file
  const zip = new JSZip.default();

  // Create a 'sounds' folder in the ZIP file
  const soundsFolder = zip.folder('sounds');

  if (!soundsFolder) {
    throw new Error('Failed to create sounds folder');
  }

  for (const sound of soundsArray) {
    if (!sound) continue;

    const hash = soundsMapping[sound] || '';

    if (!hash) {
      console.error(`Sound file ${sound} not found in sounds mapping`);
      continue;
    }

    // Download the sound from Mojang servers
    const soundFileUrl = `https://resources.download.minecraft.net/${hash.slice(
      0,
      2,
    )}/${hash}`;

    let soundFileBuffer: ArrayBuffer;

    try {
      const response = await fetch(soundFileUrl);
      soundFileBuffer = await response.arrayBuffer();
      console.log(`Retrieved sound file with hash ${hash}`);
    } catch (e) {
      console.error(`Error retrieving sound file with hash ${hash}: ${e}`);
      continue;
    }

    // Add sounds to the 'sounds' folder
    const soundFileName = hash;
    soundsFolder.file(soundFileName, soundFileBuffer);
  }

  const soundHashes = soundsArray.map((sound) => soundsMapping[sound] || '');

  // Obfuscate the song and add it to the ZIP file
  const obfuscatedSong = SongObfuscator.obfuscateSong(nbsSong, soundHashes);
  const songBuffer = obfuscatedSong.toArrayBuffer();
  zip.file('song.nbs', songBuffer);

  // Generate the ZIP file as a buffer
  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    mimeType: 'application/zip', // default
    comment: 'Uploaded to Note Block World',
    // TODO: explore adding a password to the ZIP file
    // https://github.com/Stuk/jszip/issues/115
    // https://github.com/Stuk/jszip/pull/696
  });

  return zipBuffer;
}
