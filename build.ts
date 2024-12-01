import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { getLatestVersionSoundList } from './shared/features/sounds';

function writeJSONFile(
  dir: string,
  fileName: string,
  data: Record<string, any> | string[],
) {
  const path = resolve(dir, fileName);
  const jsonString = JSON.stringify(data, null, 0);
  writeFileSync(path, jsonString);
}

const dataDir = resolve(__dirname, 'server', 'public', 'data');

const soundListPath = 'soundList.json';

// Try to create the output directory if it doesn't exist
try {
  mkdirSync(dataDir, { recursive: true });
} catch (err) {
  if (err.code !== 'EEXIST') {
    throw err;
  }
}

// If the files already exist, exit early
const files = [soundListPath].map((fileName) => resolve(dataDir, fileName));

if (files.every((file) => existsSync(file))) {
  console.log('Sound data files already exist; skipping generation.');
  process.exit(0);
}

console.log('Generating sound data files...');

// Write list of sounds in the latest MC version to a JSON file
// Filter the list to only include sounds that match the chosen patterns
// (defined in the shared/ module)
getLatestVersionSoundList().then((soundList) => {
  writeJSONFile(dataDir, soundListPath, soundList);
});
