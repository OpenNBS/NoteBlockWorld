import { Song } from '@encode42/nbs.js';
import JSZip from 'jszip';

import { SongObfuscator } from './obfuscate';

export async function obfuscateAndPackSong(
  nbsSong: Song,
  soundsArray: string[],
  soundsMapping: Record<string, string>,
) {
  // Create a ZIP file with the obfuscated song in the root as 'song.nbs'
  // and the sounds in a 'sounds' folder. Return the ZIP file as a buffer.

  // Create a new empty ZIP file
  const zip = new JSZip();

  // Create a 'sounds' folder in the ZIP file
  const soundsFolder = zip.folder('sounds');

  if (!soundsFolder) {
    throw new Error('Failed to create sounds folder');
  }

  for (const sound of soundsArray) {
    // Look up hash of the file in the sounds mapping
    const hash = soundsMapping[sound];

    if (!hash) {
      console.error(`Sound file ${sound} not found in sounds mapping`);
      continue;
    }

    // Download the sound from Mojang servers
    const soundFileUrl = `https://resources.download.minecraft.net/${hash.slice(
      0,
      2,
    )}/${hash}`;

    let soundFileBuffer: Blob;

    try {
      const response = await fetch(soundFileUrl);
      soundFileBuffer = await response.blob();
    } catch (e) {
      console.error(`Error retrieving sound file with hash ${hash}: ${e}`);
      continue;
    }

    // Add sounds to the 'sounds' folder
    const soundFileName = `${hash}.ogg`;
    soundsFolder.file(soundFileName, soundFileBuffer);
  }

  // Obfuscate the song and add it to the ZIP file
  const obfuscatedSong = SongObfuscator.obfuscateSong(nbsSong);
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
