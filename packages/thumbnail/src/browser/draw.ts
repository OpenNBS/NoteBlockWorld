import { drawNotes } from '../shared/drawCore';
import type { DrawParams } from '../shared/types';

import { createCanvas, noteBlockImage, useFont } from './canvas';

useFont();

export const drawNotesOffscreen = async (params: DrawParams) => {
  return await drawNotes(params, createCanvas, noteBlockImage);
};

export const swap = (src: OffscreenCanvas, dst: HTMLCanvasElement) => {
  const ctx = dst.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
};
