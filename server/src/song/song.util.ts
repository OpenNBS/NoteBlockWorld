const removeNonAscii = (str: string) => str.replace(/[^\x20-\x7E]/g, '_');
