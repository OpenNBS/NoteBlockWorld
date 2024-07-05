import { Song } from '@encode42/nbs.js';

function removeNonAscii(str: string) {
  return str.replace(/[^\x20-\x7E\n]/g, '_');
}

export function injectSongFileMetadata(
  nbsSong: Song,
  title: string,
  author: string,
  originalAuthor: string,
  description: string,
) {
  description += '\n\nUploaded to Note Block World';

  nbsSong.meta.name = removeNonAscii(title);
  nbsSong.meta.author = removeNonAscii(author);
  nbsSong.meta.originalAuthor = removeNonAscii(originalAuthor);
  nbsSong.meta.description = removeNonAscii(description);
}
