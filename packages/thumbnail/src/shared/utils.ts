import type { DrawingCanvas, DrawContext2D } from './drawTypes';

export interface ImageLike {
  width: number;
  height: number;
}

export const instrumentColors = [
  '#1964ac',
  '#3c8e48',
  '#be6b6b',
  '#bebe19',
  '#9d5a98',
  '#572b21',
  '#bec65c',
  '#be19be',
  '#52908d',
  '#bebebe',
  '#1991be',
  '#be2328',
  '#be5728',
  '#19be19',
  '#be1957',
  '#575757',
];

const tintedImages: Record<string, DrawingCanvas> = {};

// Function to apply a tint to an image
export const tintImage = (
  image: ImageLike,
  color: string,
  createCanvas: (w: number, h: number) => DrawingCanvas,
): DrawingCanvas => {
  const key = `${color}`;

  if (tintedImages[key]) {
    return tintedImages[key];
  }

  const canvas = createCanvas(image.width, image.height);
  const ctx: DrawContext2D = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'hard-light';
  ctx.globalAlpha = 0.67;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  tintedImages[key] = canvas;
  return canvas;
};

// Function to convert key number to key text
export const getKeyText = (key: number): string => {
  const octaves = Math.floor((key + 9) / 12);

  const notes = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];

  const note = notes[(key + 9) % 12];

  return `${note}${octaves}`;
};

const getLuma = (color: string): number => {
  // source: https://stackoverflow.com/a/12043228/9045426
  const c = color?.substring(1) || ''; // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 255; // extract red
  const g = (rgb >> 8) & 255; // extract green
  const b = (rgb >> 0) & 255; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  return luma;
};

export const isDarkColor = (color: string, threshold = 40): boolean => {
  return getLuma(color) < threshold;
};
