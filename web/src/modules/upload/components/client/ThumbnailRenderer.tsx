import { Song } from '@encode42/nbs.js';
import type { Note } from '@nbw/features/thumbnail';
import { drawFrame } from '@nbw/features/thumbnail';
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
    drawFrame({
      notes,
      startTick,
      startLayer,
      zoomLevel,
      canvas,
      backgroundColor,
    });
  }, [notes, startTick, startLayer, zoomLevel, backgroundColor]);

  return <canvas ref={canvasRef} className={'w-full rounded-lg'} />;
};
