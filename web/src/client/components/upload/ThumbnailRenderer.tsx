import { Song } from '@encode42/nbs.js';
import type { Note } from '@web/src/client/components/utils/thumbnail.util';
import drawNotes from '@web/src/client/components/utils/thumbnail.util';

import { useEffect, useRef } from 'react';

export const getThumbnailNotes = (song: Song): Note[] => {
  const notes = song.layers
    .map((layer) =>
      layer.notes.map((note, tick) => {
        const data = {
          tick: tick,
          layer: layer.id,
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
};
export const ThumbnailRendererCanvas = ({
  notes,
  zoomLevel,
  startTick,
  startLayer,
}: ThumbnailRendererCanvasProps) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;
    drawNotes(canvas, notes, startTick, startLayer, zoomLevel);
  }, [notes, startTick, startLayer, zoomLevel]);

  return <canvas ref={canvasRef} className={'w-full rounded-lg'} />;
};
