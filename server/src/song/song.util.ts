import { customAlphabet } from 'nanoid';

export function removeExtraSpaces(input: string): string {
  return input
    .replace(/ +/g, ' ') // replace multiple spaces with one space
    .replace(/\n\n+/g, '\n\n') // replace 3+ newlines with two newlines
    .trim(); // remove leading and trailing spaces
}

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 10);

export const generateSongId = () => {
  return nanoid();
};
