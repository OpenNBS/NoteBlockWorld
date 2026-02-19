import fs from 'fs';
import path from 'path';

import {
  createCanvas as napiCreateCanvas,
  loadImage,
  GlobalFonts,
  Canvas,
} from '@napi-rs/canvas';

import type { DrawingCanvas } from '../shared/drawTypes';

export const createCanvas = (w: number, h: number): DrawingCanvas =>
  napiCreateCanvas(w, h) as unknown as DrawingCanvas;

export const getPath = (filename: string) => {
  const candidates = [
    path.join(process.cwd(), filename),
    path.join(process.cwd(), 'packages/thumbnail', filename),
  ];
  return candidates.find(fs.existsSync) ?? candidates[0]!;
};

export const useFont = () => {
  GlobalFonts.registerFromPath(
    getPath('assets/fonts/Lato-Regular.ttf'),
    'Lato',
  );
};

export const noteBlockImage = loadImage(
  getPath('assets/img/note-block-grayscale.png'),
);

export const saveToImage = (canvas: Canvas) => canvas.encode('png');
