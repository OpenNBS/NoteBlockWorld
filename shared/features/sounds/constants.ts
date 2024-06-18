import { deepFreeze } from '@shared/validation/common/deepFreeze';

import { soundListData } from './soundListData';

export const SOUND_LIST = deepFreeze(soundListData as Record<string, string>);

export const SOUND_LIST_KEYS = Object.keys(soundListData);

export const SOUND_LIST_VALUES = Object.values(soundListData);

export const SEARCH_INCUDE_PATTERNS = [/random/g, /fireworks/g] as const;

export const SOUND_LIST_FILTERED = Object.entries(SOUND_LIST)
  .filter(
    ([key]) => !SEARCH_INCUDE_PATTERNS.some((pattern) => pattern.test(key)),
  )
  .reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
