/* eslint-disable @typescript-eslint/no-var-requires */

let content = {} as any;

if (typeof document === 'undefined') {
  // Assume Node.js environment
  const canvasModule = require('@napi-rs/canvas');
  const { createCanvas, loadImage, registerFont, GlobalFonts } = canvasModule;

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
    return canvas.encode('png');
  };

  // Load note block image
  let noteBlockImage;

  try {
    noteBlockImage = loadImage(getPath('/img/note-block-grayscale.png'));
  } catch (error) {
    console.log('Error loading image: ', error);
  }

  const useFont = () => {
    GlobalFonts.registerFromPath(getPath('/fonts/Lato-Regular.ttf'), 'Lato');
  };

  useFont();

  content = {
    createCanvas,
    loadImage,
    registerFont,
    getPath,
    useFont,
    saveToImage,
    noteBlockImage,
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

  // TODO: refactor into resources attribute of some sort

  // Load note block image
  const noteBlockImage = loadImage(getPath('/img/note-block-grayscale.png'));

  // Register font
  const useFont = () => {
    const f = new FontFace('Lato', 'url(/fonts/Lato-Regular.ttf)');

    f.load().then((font) => {
      document.fonts.add(font);
    });
  };

  useFont();

  const Canvas = HTMLCanvasElement;
  const Image = HTMLImageElement;

  content = {
    createCanvas,
    loadImage,
    getPath,
    saveToImage,
    noteBlockImage,
    Canvas,
    Image,
  };
}

const {
  createCanvas,
  loadImage,
  getPath,
  useFont,
  saveToImage,
  noteBlockImage,
  Canvas,
  Image,
} = content;

export {
  createCanvas,
  loadImage,
  getPath,
  useFont,
  saveToImage,
  noteBlockImage,
  Canvas,
  Image,
};
