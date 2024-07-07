import { customAlphabet } from 'nanoid';

export function removeExtraSpaces(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 10);

export const generateSongId = () => {
  return nanoid();
};
