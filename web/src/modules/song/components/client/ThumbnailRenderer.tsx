import type { Note } from '@shared/features/thumbnail';
import { drawNotesOffscreen, swap } from '@shared/features/thumbnail';
import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { UploadSongForm } from './SongForm.zod';

type ThumbnailRendererCanvasProps = {
  notes: Note[];
  formMethods: UseFormReturn<UploadSongForm>;
};

export const ThumbnailRendererCanvas = ({
  notes,
  formMethods,
}: ThumbnailRendererCanvasProps) => {
  const canvasRef = useRef(null);
  const drawRequest = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [zoomLevel, startTick, startLayer, backgroundColor] = formMethods.watch(
    [
      'thumbnailData.zoomLevel',
      'thumbnailData.startTick',
      'thumbnailData.startLayer',
      'thumbnailData.backgroundColor',
    ],
  );

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    // Set canvas size to match the container size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.width / (1280 / 768);
    /*
    // on mouse scroll event
    canvas.addEventListener('wheel', (e) => {
      const delta = e.deltaY;
      // do something with delta
      const maxZoom = 5;
      const minZoom = 1;
      const zoomSpeed = 0.1;
      const newZoom = zoomLevel + delta * zoomSpeed;
      formMethods.setValue(
        'thumbnailData.zoomLevel',
        Math.min(Math.max(newZoom, minZoom), maxZoom),
      );
    });

    // on mouse drag event
    canvas.addEventListener('mousedown', (e) => {
      const mouse = {
        x: e.clientX,
        y: e.clientY,
      };

      const minLayer = 0;
      const maxLayer = 3;

      const minTick = 0;
      const maxTick = 1000;

      canvas.addEventListener('mousemove', (e) => {
        const dx = e.clientX - mouse.x;
        const dy = e.clientY - mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        // do something with dx and dy

        const newTick = startTick - dy;
        const newLayer = startLayer + dx;

        formMethods.setValue(
          'thumbnailData.startTick',
          Math.min(Math.max(newTick, minTick), maxTick),
        );

        formMethods.setValue(
          'thumbnailData.startLayer',
          Math.min(Math.max(newLayer, minLayer), maxLayer),
        );
      });
    });
    canvas.addEventListener('mouseup', () => {
      canvas.removeEventListener('mousemove', () => undefined);
    });
    return () => {
      canvas.removeEventListener('mousedown', () => undefined);
      canvas.removeEventListener('mouseup', () => undefined);
      canvas.removeEventListener('wheel', () => undefined);
    };
    */
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
