import { BG_COLORS } from './colors';

export const THUMBNAIL_CONSTANTS = {
    zoomLevel: {
        min    : 1,
        max    : 5,
        default: 3
    },
    startTick: {
        default: 0
    },
    startLayer: {
        default: 0
    },
    backgroundColor: {
        default: BG_COLORS.gray.dark
    }
} as const;
