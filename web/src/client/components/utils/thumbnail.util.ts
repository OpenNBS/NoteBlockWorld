export interface Note {
  tick: number;
  layer: number;
  key: number;
  instrument: number;
}

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

let noteBlockImage: HTMLImageElement | null = null;
const tintedImages: Record<string, HTMLCanvasElement> = {};

// Function to load an image from the server
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Function to apply tint to an image
function tintImage(image: HTMLImageElement, color: string): HTMLCanvasElement {
  if (tintedImages[color]) {
    return tintedImages[color];
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = image.width;
  canvas.height = image.height;

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
  endLayer: number
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

// Function to draw Minecraft note blocks on the canvas
export default async function drawNotes(
  canvas: HTMLCanvasElement,
  notes: Note[],
  startTick: number,
  startLayer: number,
  zoomLevel: number,
  imgWidth: number = 1280,
  imgHeight: number = 720
) {
  // Get canvas context
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Disable anti-aliasing
  ctx.imageSmoothingEnabled = false;

  // Set canvas dimensions
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.width / (imgWidth / imgHeight);

  // Calculate effective zoom level
  const zoomFactor = 2 ** (zoomLevel - 1);

  // Set scale to draw image at correct thumbnail size
  const scale = canvas.width / imgWidth;
  ctx.scale(scale, scale);
  const width = canvas.width / scale;
  const height = canvas.height / scale;

  // Draw background
  ctx.fillStyle = '#fcfcfc';
  ctx.fillRect(0, 0, width, height);

  // Draw darker vertical lines
  ctx.fillStyle = '#cccccc';
  for (let i = 0; i < width; i += 8 * zoomFactor) {
    ctx.fillRect(i, 0, 1, height);
  }

  // Load note block image if not loaded yet
  if (!noteBlockImage || noteBlockImage.src !== '/note-block-grayscale.png') {
    noteBlockImage = await loadImage('/note-block-grayscale.png');
    // TODO: note block image loading on every render is not ideal
  }

  // Iterate through note blocks and draw them
  notes
    .filter((note) =>
      noteInBounds(
        note,
        startTick,
        startLayer,
        startTick + width / (zoomFactor * 8),
        startLayer + height / (zoomFactor * 8)
      )
    )
    .forEach((note) => {
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
        8 * zoomFactor
      );

      // Draw the key text
      const keyText = getKeyText(note.key);
      ctx.fillStyle = '#ffffff';
      ctx.font = `${3 * zoomFactor}px Tahoma`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(keyText, x + 4 * zoomFactor, y + 4 * zoomFactor);
    });

  // Save the canvas as an image
  //const image = new Image();
  //image.src = canvas.toDataURL();
  //document.body.appendChild(image); // Append the image to the body
}
