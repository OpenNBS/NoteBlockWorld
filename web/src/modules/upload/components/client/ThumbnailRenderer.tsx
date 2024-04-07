import type { Note } from '@shared/features/thumbnail';
import { drawNotesOffscreen, swap } from '@shared/features/thumbnail';
import { useEffect, useRef, useState } from 'react';

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
  const drawRequest = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    // Set canvas size to match the container size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.width / (1280 / 768);
  }, []);

  useEffect(() => {
    setLoading(true);

    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    // Clear previous draw requests
    if (drawRequest.current) {
      cancelAnimationFrame(drawRequest.current);
    }
    drawRequest.current = requestAnimationFrame(async () => {
      const output = await drawNotesOffscreen({
        notes,
        startTick,
        startLayer,
        zoomLevel,
        backgroundColor,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        imgWidth: 1280,
        imgHeight: 768,
      });
      swap(output, canvas);
      setLoading(false);
    });
  }, [notes, startTick, startLayer, zoomLevel, backgroundColor]);

  return (
    <div className='relative w-full'>
      <canvas ref={canvasRef} className='w-full h-full rounded-lg' />
      {loading && (
        <div className='absolute top-0 flex items-center justify-center bg-black w-full h-full rounded-lg opacity-80'>
          Loading...
        </div>
      )}
    </div>
  );
};
