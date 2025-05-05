/* eslint-disable @typescript-eslint/no-var-requires */
import type Path from 'path';

import type NapiRs from '@napi-rs/canvas';

/*
import type {
  Canvas as NapiCanvas,
  Image as NapiImage,
  GlobalFonts as NapiGlobalFonts,
} from '@napi-rs/canvas';
*/

export interface CanvasUtils {
  createCanvas(width: number, height: number): any;
  loadImage(src: string): Promise<any>;
  getPath(filename: string): string | URL;
  useFont(): void;
  saveToImage(canvas: HTMLCanvasElement | NapiRs.Canvas): Promise<Uint8Array>;
  noteBlockImage: Promise<any> | any;
  DrawingCanvas: any;
  RenderedImage: any;
}

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

    return 'file://' + fullPath;
  };

  const saveToImage = (canvas: NapiRs.Canvas) => canvas.encode('png');

  const useFont = () => {
    GlobalFonts.registerFromPath(
      'file:' + getPath('assets/fonts/Lato-Regular.ttf').toString(),
      'Lato',
    );
  };

  let noteBlockImage: Promise<any>;

  try {
    noteBlockImage = nodeLoadImage(
      new URL(getPath('assets/img/note-block-grayscale.png')),
    );
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

  const noteBlockImage = loadImage(getPath('/img/note-block-grayscale.png'));

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
