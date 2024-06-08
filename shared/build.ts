import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { getLatestVersionSoundList } from './features/sounds';

console.log(__dirname);

// Write getLatestVersionSoundList to a json file
getLatestVersionSoundList().then((soundList) => {
  const soundListPath = resolve(__dirname, 'data/soundList.json');
  writeFileSync(soundListPath, JSON.stringify(soundList, null, 2));
  console.log(`Wrote sound list to ${soundListPath}`);
});
