export const removeNonAscii = (str: string) => {
  return str.replace(/[^\x20-\x7E]/g, '_');
};
