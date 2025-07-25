// https://stackoverflow.com/a/56984941/9045426
// https://stackoverflow.com/a/43523944/9045426

import type { SoundListType } from '@nbw/database';

interface Window {
  latestVersionSoundList: SoundListType;
}

declare global {
  // eslint-disable-next-line no-var
  var latestVersionSoundList: SoundListType;
}
