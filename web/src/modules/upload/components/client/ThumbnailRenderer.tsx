import { Song } from '@encode42/nbs.js';
import type { Note } from '@shared/features/thumbnail';
import { drawNotesOffscreen, requestFrame } from '@shared/features/thumbnail';
import { useEffect, useRef } from 'react';

export const getThumbnailNotes = (song: Song): Note[] => {
  const notes = song.layers
    .map((layer, layerId) =>
      Array.from(layer.notes).map((note, tickNumber) => {
        const data = {
          tick: tickNumber,
          layer: layerId,
          key: note.key,
          instrument: note.instrument,
        };
        return data;
      }),
    )
    .flat();
  return notes;
};

type ThumbnailRendererCanvasProps = {
  notes: Note[];
  zoomLevel: number;
  startTick: number;
  startLayer: number;
  backgroundColor: string;
};

export const ThumbnailRendererCanvas = ({
  notes,
  zoomLevel,
  startTick,
  startLayer,
  backgroundColor,
}: ThumbnailRendererCanvasProps) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    // Set canvas size to match the container size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.width / (1280 / 768);

    requestFrame(
      async () =>
        await drawNotesOffscreen({
          notes,
          startTick,
          startLayer,
          zoomLevel,
          backgroundColor,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          imgWidth: 1280,
          imgHeight: 768,
        }),
      canvas,
    );
  }, [notes, startTick, startLayer, zoomLevel, backgroundColor]);

  return <canvas ref={canvasRef} className={'w-full rounded-lg'} />;
};
