import { Song } from '@encode42/nbs.js';
import unidecode from 'unidecode';

export function injectSongFileMetadata(
  nbsSong: Song,
  title: string,
  author: string,
  originalAuthor: string,
  description: string,
  soundPaths: string[],
) {
  if (description != '') description += '\n\n';
  description += 'Uploaded to Note Block World';

  nbsSong.meta.name = unidecode(title);
  nbsSong.meta.author = unidecode(author);
  nbsSong.meta.originalAuthor = unidecode(originalAuthor);
  nbsSong.meta.description = unidecode(description);

  // Assign sound files to standard Minecraft asset names (machine- and human-friendly)
  // (Also ensures the downloaded song matches what the user picked when uploading)
  for (const [id, soundPath] of soundPaths.entries()) {
    const customId = nbsSong.instruments.firstCustomIndex + id;
    const newSoundPath = soundPath.replace('/sounds/', '/');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore //TODO: fix this
    nbsSong.instruments.loaded[customId].meta.soundFile = newSoundPath;
  }
}
