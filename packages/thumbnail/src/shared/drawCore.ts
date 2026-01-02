import type { DrawingCanvas, ImageLike } from './drawTypes';
import type { DrawParams } from './types';
import { getKeyText, instrumentColors, isDarkColor, tintImage } from './utils';

export async function drawNotes(
  params: DrawParams,
  createCanvas: (w: number, h: number) => DrawingCanvas,
  noteBlockImage: Promise<ImageLike>,
) {
  const {
    notes,
    startTick,
    startLayer,
    zoomLevel,
    backgroundColor,
    canvasWidth,
    imgWidth = 1280,
    imgHeight = 768,
  } = params;

  // Create new offscreen canvas
  const canvas = createCanvas(imgWidth, imgHeight);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

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

  const loadedNoteBlockImage = await noteBlockImage;

  // Iterate through note blocks and draw them
  const endTick = startTick + width / (zoomFactor * 8) - 1;
  const endLayer = startLayer + height / (zoomFactor * 8) - 1;

  const visibleNotes = notes.getNotesInRect({
    x1: startTick,
    y1: startLayer,
    x2: endTick,
    y2: endLayer,
  });

  for (const note of visibleNotes) {
    // Calculate position
    const x = (note.tick - startTick) * 8 * zoomFactor;
    const y = (note.layer - startLayer) * 8 * zoomFactor;
    const overlayColor = instrumentColors[note.instrument % 16] ?? '#FF00FF';

    if (!loadedNoteBlockImage) {
      throw new Error('Note block image not loaded');
    }

    // Draw the note block
    ctx.drawImage(
      tintImage(loadedNoteBlockImage, overlayColor, createCanvas),
      x,
      y,
      8 * zoomFactor,
      8 * zoomFactor,
    );

    // Draw the key text
    const keyText = getKeyText(note.key);
    ctx.fillStyle = '#ffffff';
    ctx.font = `${3 * zoomFactor}px Lato`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(keyText, x + 4 * zoomFactor, y + 4 * zoomFactor);
  }

  return canvas;
}
