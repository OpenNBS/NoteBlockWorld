import type { DrawingCanvas } from '../shared/drawTypes';

export const createCanvas = (w: number, h: number): DrawingCanvas =>
  new OffscreenCanvas(w, h) as unknown as DrawingCanvas;

export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const useFont = () => {
  const font = new FontFace('Lato', 'url(/fonts/Lato-Regular.ttf)');
  font.load().then((f) => document.fonts.add(f));
};

export const noteBlockImage = loadImage('/img/note-block-grayscale.png');

export const saveToImage = () => {
  throw new Error('saveToImage not available in browser');
};
