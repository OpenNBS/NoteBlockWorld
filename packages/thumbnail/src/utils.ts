import { createCanvas } from './canvasFactory';
import type { Canvas, Image } from './types';

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

const tintedImages: Record<string, Canvas> = {};

// Function to apply tint to an image
export const tintImage = (image: Image, color: string): Canvas => {
  if (tintedImages[color]) {
    return tintedImages[color];
  }

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Fill background with the color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Apply the note block texture to the color
  ctx.globalCompositeOperation = 'hard-light';
  ctx.globalAlpha = 0.67;
  ctx.drawImage(image, 0, 0);

  // Reset canvas settings
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  tintedImages[color] = canvas;

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
