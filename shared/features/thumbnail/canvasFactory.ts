/* eslint-disable @typescript-eslint/no-var-requires */

let content = {} as any;

if (typeof document === 'undefined') {
  // Assume Node.js environment
  const canvasModule = require('canvas');
  const { createCanvas, loadImage } = canvasModule;

  const path = require('path');

  const Canvas = canvasModule.Canvas;
  const Image = canvasModule.Image;

  const getPath = (filename: string) => {
    const dir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'assets',
      filename.split('/').join(path.sep),
    );

    console.log('dir', dir);
    return dir;
  };

  const saveToImage = (canvas: typeof Canvas) => {
    return canvas.toBuffer('image/png');
  };

  content = {
    createCanvas,
    loadImage,
    getPath,
    saveToImage,
    Canvas,
    Image,
  };
} else {
  // Assume browser environment
  const createCanvas = (width: number, height: number) => {
    const canvas = new OffscreenCanvas(width, height);
    return canvas;
  };

  const loadImage = function (src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const getPath = (filename: string) => {
    return filename;
  };

  const saveToImage = (canvas: HTMLCanvasElement) => {
    console.log('Not implemented');
  };

  const Canvas = HTMLCanvasElement;
  const Image = HTMLImageElement;

  content = {
    createCanvas,
    loadImage,
    getPath,
    saveToImage,
    Canvas,
    Image,
  };
}

const { createCanvas, loadImage, getPath, saveToImage, Canvas, Image } =
  content;

export { createCanvas, loadImage, getPath, saveToImage, Canvas, Image };
