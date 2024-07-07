import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { getLatestVersionSoundList } from './shared/features/sounds';
import { SEARCH_INCLUDE_PATTERNS } from './shared/features/sounds/filterIncludePatterns';

function writeJSONFile(
  dir: string,
  fileName: string,
  data: Record<string, any> | string[],
) {
  const path = resolve(dir, fileName);
  const jsonString = JSON.stringify(data, null, 0);
  writeFileSync(path, jsonString);
}

const frontEndDataDir = resolve(__dirname, 'web', 'public', 'data');
const sharedDataDir = resolve(__dirname, 'shared', 'data');

const soundListPath = 'soundList.json';
const filteredSoundListPath = 'filteredSoundList.json';

// Try to create the directories if they don't exist
[frontEndDataDir, sharedDataDir].forEach((dir) => {
  try {
    mkdirSync(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
});

// If the files already exist, exit early
const files = [soundListPath, filteredSoundListPath]
  .map((fileName) =>
    [frontEndDataDir, sharedDataDir].map((dir) => resolve(dir, fileName)),
  )
  .flat();

if (files.every((file) => existsSync(file))) {
  console.log('Sound data files already exist; skipping generation.');
  process.exit(0);
}

console.log('Generating sound data files...');

// Write list of sounds in the latest MC version to a JSON file
// Filter the list to only include sounds that match the chosen patterns
// (defined in the shared/ module)
getLatestVersionSoundList().then((soundList) => {
  const filteredSoundList: string[] = Object.keys(soundList).filter((sound) =>
    SEARCH_INCLUDE_PATTERNS.some((pattern) => new RegExp(pattern).test(sound)),
  );

  [frontEndDataDir, sharedDataDir].forEach((dir) => {
    writeJSONFile(dir, soundListPath, soundList);
    writeJSONFile(dir, filteredSoundListPath, filteredSoundList);
  });
});
