import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { getLatestVersionSoundList } from './shared/features/sounds/fetchSoundList';

const frontEndDataDir = resolve(__dirname, 'web', 'public', 'data');
const sharedDataDir = resolve(__dirname, 'shared', 'data');

// try to create the directories if they don't exist
[frontEndDataDir, sharedDataDir].forEach((dir) => {
  try {
    mkdirSync(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
});

// if the fles already exist, exit early
const files = [
  'soundList',
  'filteredSoundList',
  'soundListKeys',
  'soundListValues',
]
  .map((fileName) => `${fileName}.json`)
  .map((fileName) =>
    [frontEndDataDir, sharedDataDir].map((dir) => `${dir}/${fileName}`),
  )
  .flat();

if (files.every((file) => existsSync(file))) {
  console.log('Files already exist, exiting early');
  process.exit(0);
}

// Write getLatestVersionSoundList to JSON files
getLatestVersionSoundList().then((soundList) => {
  const SEARCH_INCUDE_PATTERNS = [/random/g, /fireworks/g];

  const filteredSoundList: Record<string, string> = Object.keys(
    soundList,
  ).reduce((acc, key) => {
    const isInclude = SEARCH_INCUDE_PATTERNS.some((pattern) =>
      pattern.test(key),
    );

    if (isInclude) {
      acc[key] = soundList[key];
    }

    return acc;
  }, {} as Record<string, string>);

  const SOUND_LIST_KEYS = Object.keys(filteredSoundList);
  const SOUND_LIST_VALUES = Object.values(filteredSoundList);

  function writeJSONFile(dir: string, fileName: string, data: any) {
    writeFileSync(`${dir}/${fileName}.json`, JSON.stringify(data, null, 0));
  }

  [frontEndDataDir, sharedDataDir].forEach((dir) => {
    writeJSONFile(dir, 'soundList', soundList);
    writeJSONFile(dir, 'filteredSoundList', filteredSoundList);
    writeJSONFile(dir, 'soundListKeys', SOUND_LIST_KEYS);
    writeJSONFile(dir, 'soundListValues', SOUND_LIST_VALUES);
  });
});
