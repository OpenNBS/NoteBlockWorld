import { TIMESPANS, UPLOAD_CONSTANTS } from '../config-shim.js';

/** Keys of the upload visibility / category / license maps from config. */
export type VisibilityType = keyof typeof UPLOAD_CONSTANTS.visibility;
export type CategoryType = keyof typeof UPLOAD_CONSTANTS.categories;
export type LicenseType = keyof typeof UPLOAD_CONSTANTS.licenses;

/** Featured-songs buckets (hour / day / week / …) — matches `pageQueryDTOSchema` `timespan`. */
export type TimespanType = (typeof TIMESPANS)[number];
