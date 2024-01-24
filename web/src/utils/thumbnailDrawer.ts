export interface Note {
  tick: number;
  layer: number;
  key: number;
  instrument: number;
}

const instrumentColors = [
  "#1964ac",
  "#3c8e48",
  "#be6b6b",
  "#bebe19",
  "#9d5a98",
  "#4d3c98",
  "#bec65c",
  "#be19be",
  "#52908d",
  "#bebebe",
  "#1991be",
  "#be2328",
  "#be5728",
  "#19be19",
  "#be1957",
  "#575757",
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

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  ctx.globalCompositeOperation = "color";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "destination-in";
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
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
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
  zoomLevel: number
) {
  // Get canvas context
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Set canvas dimensions
  canvas.height = canvas.width / (16 / 9);

  // Calculate effective zoom level
  const scale = canvas.width / 1280;
  const zoomFactor = 2 ** (zoomLevel - 1);
  const effectiveZoomLevel = zoomFactor * scale;

  // Draw background
  ctx.fillStyle = "#fcfcfc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw darker vertical lines
  ctx.fillStyle = "#cccccc";
  for (let i = 0; i < canvas.width; i += 8 * effectiveZoomLevel) {
    ctx.fillRect(i, 0, 1, canvas.height);
  }

  // Load note block image if not loaded yet
  if (!noteBlockImage || noteBlockImage.src !== "/note-block-grayscale.png") {
    noteBlockImage = await loadImage("/note-block-grayscale.png");
  }

  // Iterate through note blocks and draw them
  notes
    .filter((note) =>
      noteInBounds(
        note,
        startTick,
        startLayer,
        startTick + canvas.width / (effectiveZoomLevel * 8),
        startLayer + canvas.height / (effectiveZoomLevel * 8)
      )
    )
    .forEach((note) => {
      // Calculate position
      const x = (note.tick - startTick) * 8 * effectiveZoomLevel;
      const y = (note.layer - startLayer) * 8 * effectiveZoomLevel;
      const overlayColor = instrumentColors[note.instrument % 16];

      // Draw the note block
      ctx.drawImage(
        tintImage(noteBlockImage, overlayColor),
        x,
        y,
        8 * effectiveZoomLevel,
        8 * effectiveZoomLevel
      );

      // Draw the key text
      const keyText = getKeyText(note.key);
      ctx.fillStyle = "#ffffff";
      ctx.font = `${3 * effectiveZoomLevel}px Tahoma`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        keyText,
        x + 4 * effectiveZoomLevel,
        y + 4 * effectiveZoomLevel
      );
    });

  // Save the canvas as an image
  //const image = new Image();
  //image.src = canvas.toDataURL();
  //document.body.appendChild(image); // Append the image to the body
}