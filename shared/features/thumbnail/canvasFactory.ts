/* eslint-disable @typescript-eslint/no-var-requires */
import type Path from 'path';

import type NapiRs from '@napi-rs/canvas';

import { CanvasUtils } from './types';

let canvasUtils: CanvasUtils;

if (typeof document === 'undefined') {
  // Node.js/Bun environment
  const canvasModule = require('@napi-rs/canvas') as typeof NapiRs;
  const path = require('path') as typeof Path;

  const {
    createCanvas: nodeCreateCanvas,
    loadImage: nodeLoadImage,
    GlobalFonts,
  } = canvasModule;

  const getPath = (filename: string) => {
    const workingDir = process.cwd();
    const fullPath = path.join(workingDir, filename.split('/').join(path.sep));

    return fullPath;
  };

  const saveToImage = (canvas: NapiRs.Canvas) => canvas.encode('png');

  const useFont = () => {
    const path = getPath('assets/fonts/Lato-Regular.ttf').toString();
    console.log('Font path: ', path);

    GlobalFonts.registerFromPath(path, 'Lato');
  };

  let noteBlockImage: Promise<any>;

  try {
    const path = getPath('assets/img/note-block-grayscale.png');

    noteBlockImage = nodeLoadImage(path);
  } catch (error) {
    console.error('Error loading image: ', error);
    noteBlockImage = Promise.reject(error);
  }

  canvasUtils = {
    createCanvas: nodeCreateCanvas,
    loadImage: nodeLoadImage,
    getPath,
    useFont,
    saveToImage,
    noteBlockImage,
    DrawingCanvas: canvasModule.Canvas,
    RenderedImage: canvasModule.Image,
  };
} else {
  // Browser environment
  const createCanvas = (width: number, height: number) => {
    return new OffscreenCanvas(width, height);
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const getPath = (filename: string) => filename;

  const saveToImage = (_canvas: any) => {
    console.warn('saveToImage not implemented in browser');
    throw new Error('saveToImage not implemented in browser');
  };

  const useFont = () => {
    const font = new FontFace('Lato', 'url(/fonts/Lato-Regular.ttf)');

    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });
  };

  const noteBlockImagePath = getPath('/img/note-block-grayscale.png');

  const noteBlockImage = loadImage(noteBlockImagePath);

  canvasUtils = {
    createCanvas,
    loadImage,
    getPath,
    useFont,
    saveToImage,
    noteBlockImage,
    DrawingCanvas: HTMLCanvasElement,
    RenderedImage: HTMLImageElement,
  };
}

export const {
  createCanvas,
  loadImage,
  getPath,
  useFont,
  saveToImage,
  noteBlockImage,
  DrawingCanvas,
  RenderedImage,
} = canvasUtils;
