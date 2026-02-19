import type { Canvas } from '@napi-rs/canvas';

import { drawNotes } from '../shared/drawCore';
import type { DrawParams } from '../shared/types';

import { createCanvas, noteBlockImage, saveToImage, useFont } from './canvas';

useFont();

export const drawNotesOffscreen = async (params: DrawParams) => {
  return await drawNotes(params, createCanvas, noteBlockImage);
};

export const drawToImage = async (params: DrawParams) => {
  const canvas = await drawNotesOffscreen(params);
  const nodeCanvas = canvas as Canvas; // Type=narrow to Node canvas for saving
  return Buffer.from(await saveToImage(nodeCanvas));
};
