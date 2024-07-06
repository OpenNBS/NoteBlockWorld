import { Song } from '@encode42/nbs.js';
import unidecode from 'unidecode';

export function injectSongFileMetadata(
  nbsSong: Song,
  title: string,
  author: string,
  originalAuthor: string,
  description: string,
) {
  description += '\n\nUploaded to Note Block World';

  nbsSong.meta.name = unidecode(title);
  nbsSong.meta.author = unidecode(author);
  nbsSong.meta.originalAuthor = unidecode(originalAuthor);
  nbsSong.meta.description = unidecode(description);
}
