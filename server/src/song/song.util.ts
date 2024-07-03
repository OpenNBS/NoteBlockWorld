import { customAlphabet } from 'nanoid';

export const removeNonAscii = (str: string) => {
  return str.replace(/[^\x20-\x7E\n]/g, '_');
};

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 10);

export const generateSongId = () => {
  return nanoid();
};
