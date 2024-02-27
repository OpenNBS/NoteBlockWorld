import { Song } from '@encode42/nbs.js';
import { useEffect, useRef } from 'react';

import type { Note } from './thumbnail.util';
import { drawFrame } from './thumbnail.util';

export const getThumbnailNotes = (song: Song): Note[] => {
  const notes = song.layers.get
    .map((layer, layerId) =>
      Array.from(layer.notes).map((tick) => {
        const [tickNumber, note] = tick;
        const data = {
          tick: tickNumber,
          layer: layerId,
          key: note.key,
          instrument: note.instrument,
        };
        return data;
      })
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
    drawFrame(canvas, notes, startTick, startLayer, zoomLevel, backgroundColor);
  }, [notes, startTick, startLayer, zoomLevel, backgroundColor]);

  return <canvas ref={canvasRef} className={'w-full rounded-lg'} />;
};
