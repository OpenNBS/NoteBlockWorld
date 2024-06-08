import { deepFreeze } from '@shared/validation/common/deepFreeze';

import soundListData from '../../data/soundList.json';

export const SOUND_LIST = deepFreeze(soundListData as Record<string, string>);

export const SOUND_LIST_KEYS = deepFreeze(Object.keys(SOUND_LIST));

export const SOUND_LIST_VALUES = deepFreeze(Object.values(SOUND_LIST));

export const SEARCH_INCUDE_PATTERNS = deepFreeze([
  /cave/g,
  /amethyst/g,
  /random/g,
  /fireworks/g,
]);
