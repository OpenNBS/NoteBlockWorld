import { Song } from '@encode42/nbs.js';

import {
  Canvas,
  Image,
  createCanvas,
  getPath,
  loadImage,
  saveToImage,
} from './canvasFactory';

export interface Note {
  tick: number;
  layer: number;
  key: number;
  instrument: number;
}

interface DrawParams {
  notes: Note[];
  startTick: number;
  startLayer: number;
  zoomLevel: number;
  backgroundColor: string;
  canvasWidth?: number;
  canvasHeight?: number;
  imgWidth: number;
  imgHeight: number;
}

type Canvas = typeof Canvas;
type Image = typeof Image;

export const getThumbnailNotes = (song: Song): Note[] => {
  const notes = song.layers
    .map((layer) =>
      Object.entries(layer.notes).map(([tick, note]) => {
        const data = {
          tick: Number(tick),
          layer: layer.id,
          key: note.key,
          instrument: note.instrument,
        };
        return data;
      }),
    )
    .flat();
  return notes;
};

const instrumentColors = [
  '#1964ac',
  '#3c8e48',
  '#be6b6b',
  '#bebe19',
  '#9d5a98',
  '#4d3c98',
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

export const bgColors = [
  '#ffffff',
  '#77172e',
  '#692b17',
  '#7c4a03',
  '#264d3b',
  '#0c625d',
  '#256377',
  '#284255',
  '#472e5b',
  '#6c394f',
  '#4b443a',
  '#232427',
];

const tintedImages: Record<string, Canvas> = {};

// Function to apply tint to an image
function tintImage(image: Image, color: string): Canvas {
  if (tintedImages[color]) {
    return tintedImages[color];
  }

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  //canvas.style.imageRendering = 'optimizeContrast';
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(image, 0, 0);

  ctx.globalCompositeOperation = 'color';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(image, 0, 0);

  tintedImages[color] = canvas;
  return canvas;
}

// Function to check if a note is within the bounds of the canvas
function noteInBounds(
  note: Note,
  startTick: number,
  startLayer: number,
  endTick: number,
  endLayer: number,
): boolean {
  return (
    note.tick >= startTick &&
    note.layer >= startLayer &&
    note.tick < endTick &&
    note.layer < endLayer
  );
}

// Function to convert key number to key text
function getKeyText(key: number): string {
  const octaves = Math.floor(key / 12);
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
  const note = notes[key % 12];
  return `${note}${octaves}`;
}

function getLuma(color: string): number {
  // source: https://stackoverflow.com/a/12043228/9045426

  const c = color.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  return luma;
}

function isDarkColor(color: string, threshold = 40): boolean {
  return getLuma(color) < threshold;
}

// Create variable to store last callback id
const drawId: number[] = [];

export async function requestFrame(drawFunction: () => Canvas, canvas: Canvas) {
  if (drawId.length) {
    console.log('Cancelling frame', drawId[0]);
    cancelAnimationFrame(drawId[0]);
  }
  drawId.push(
    requestAnimationFrame(async () => drawAndSwap(await drawFunction, canvas)),
  );
}

export async function drawAndSwap(
  drawFunction: () => Promise<Canvas>,
  canvas: Canvas,
) {
  /**
   * Run a `drawFunction` that returns a canvas and draw it to the passed `canvas`.
   *
   * @param drawFunction - Function that draws to a canvas and returns it
   * @param canvas - Canvas to draw the output of `drawFunction` to
   *
   * @returns Nothing
   */

  // Get canvas context
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const output = await drawFunction();

  console.log(output);

  // Swap the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(output, 0, 0);
}

export async function drawNotesOffscreen({
  notes,
  startTick,
  startLayer,
  zoomLevel,
  backgroundColor,
  canvasWidth,
  canvasHeight,
  imgWidth = 1280,
  imgHeight = 768,
}: DrawParams) {
  // Create new offscreen canvas
  const canvas = createCanvas(imgWidth, imgHeight);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get offscreen canvas context');
  }

  // Random execution ID
  const id = Math.random().toString(36).substring(7);
  console.log(`Executing drawNotes with ID ${id}`);

  // Disable anti-aliasing
  ctx.imageSmoothingEnabled = false;

  // Calculate effective zoom level
  const zoomFactor = 2 ** (zoomLevel - 1);

  // Set scale to draw image at correct thumbnail size
  if (canvasWidth !== undefined) {
    const scale = canvasWidth / imgWidth;
    ctx.scale(scale, scale);
  }
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Draw background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Check if the background color is dark or light
  const isDark = isDarkColor(backgroundColor, 90);
  if (isDark) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  } else {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  }

  // Draw vertical lines
  for (let i = 0; i < width; i += 8 * zoomFactor) {
    ctx.fillRect(i, 0, 1, height);
  }

  // Load note block image if not loaded yet
  const noteBlockImage = await loadImage(
    getPath('/img/note-block-grayscale.png'),
  );

  // Iterate through note blocks and draw them
  notes
    .filter((note) =>
      noteInBounds(
        note,
        startTick,
        startLayer,
        startTick + width / (zoomFactor * 8),
        startLayer + height / (zoomFactor * 8),
      ),
    )
    .forEach(async (note) => {
      // Calculate position
      const x = (note.tick - startTick) * 8 * zoomFactor;
      const y = (note.layer - startLayer) * 8 * zoomFactor;
      const overlayColor = instrumentColors[note.instrument % 16];

      if (!noteBlockImage) {
        throw new Error('Note block image not loaded');
      }
      // Draw the note block
      ctx.drawImage(
        tintImage(noteBlockImage, overlayColor),
        x,
        y,
        8 * zoomFactor,
        8 * zoomFactor,
      );

      // Draw the key text
      const keyText = getKeyText(note.key);
      ctx.fillStyle = '#ffffff';
      ctx.font = `${3 * zoomFactor}px Tahoma`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(keyText, x + 4 * zoomFactor, y + 4 * zoomFactor);
    });

  console.log(`Finished drawNotes with ID ${id}`);
  return canvas;
}

export async function drawToImage(params: DrawParams): Promise<Buffer> {
  let canvas;
  const { imgWidth, imgHeight } = params;

  if (!canvas) {
    canvas = createCanvas(imgWidth, imgHeight);
  }

  await drawAndSwap(() => drawNotesOffscreen(params), canvas);
  const buffer = saveToImage(canvas);
  return buffer;
}
