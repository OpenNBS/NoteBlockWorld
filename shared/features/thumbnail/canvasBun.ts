import { createCanvas, loadImage, GlobalFonts, Canvas, Image } from '@napi-rs/canvas';
import path from 'path';

const __filename =  path.resolve();
const __dirname =  path.dirname(__filename);

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

const saveToImage = (canvas: Canvas) => {
  return canvas.toBuffer('image/png'); // Export the canvas as a PNG buffer
};

let noteBlockImage: Promise<Image> | undefined; // Corrected type

try {
  noteBlockImage = loadImage(getPath('/img/note-block-grayscale.png'));
} catch (error) {
  console.log('Error loading image: ', error);
}

const useFont = () => {
  GlobalFonts.registerFromPath(getPath('/fonts/Lato-Regular.ttf'), 'Lato');
};

useFont();

const content = {
  createCanvas,
  loadImage,
  registerFont:GlobalFonts.registerFromPath,
  getPath,
  useFont,
  saveToImage,
  noteBlockImage,
  Canvas,
  Image,
};