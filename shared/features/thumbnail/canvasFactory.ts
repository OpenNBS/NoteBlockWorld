let content = {} as any;

if (typeof document === 'undefined') {
  // Assume Node.js environment
  const canvasModule = require('canvas');
  const { createCanvas, loadImage } = canvasModule;

  const Canvas = canvasModule.Canvas;
  const Image = canvasModule.Image;

  content = {
    createCanvas,
    loadImage,
    Canvas,
    Image,
  };
} else {
  // Assume browser environment
  const createCanvas = (width?: number, height?: number) => {
    const canvas = document.createElement('canvas');
    if (width) canvas.width = width;
    if (height) canvas.height = height;
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

  const Canvas = HTMLCanvasElement;
  const Image = HTMLImageElement;

  content = {
    createCanvas,
    loadImage,
    Canvas,
    Image,
  };
}

const { createCanvas, loadImage, Canvas, Image } = content;
export { createCanvas, loadImage, Canvas, Image };
