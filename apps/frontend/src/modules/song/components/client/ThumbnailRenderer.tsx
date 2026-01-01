'use client';

import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { NoteQuadTree } from '@nbw/song';

import { UploadSongForm } from './SongForm.zod';

// Dynamically import thumbnail functions to avoid SSR issues with HTMLCanvasElement
const loadThumbnailFunctions = async () => {
  const thumbnail = await import('@nbw/thumbnail');
  return {
    drawNotesOffscreen: thumbnail.drawNotesOffscreen,
    swap: thumbnail.swap,
  };
};

type ThumbnailRendererCanvasProps = {
  notes: NoteQuadTree;
  formMethods: UseFormReturn<UploadSongForm>;
};

export const ThumbnailRendererCanvas = ({
  notes,
  formMethods,
}: ThumbnailRendererCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRequest = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [functionsLoaded, setFunctionsLoaded] = useState(false);
  const thumbnailFunctionsRef = useRef<{
    drawNotesOffscreen: typeof import('@nbw/thumbnail').drawNotesOffscreen;
    swap: typeof import('@nbw/thumbnail').swap;
  } | null>(null);

  const [zoomLevel, startTick, startLayer, backgroundColor] = formMethods.watch(
    [
      'thumbnailData.zoomLevel',
      'thumbnailData.startTick',
      'thumbnailData.startLayer',
      'thumbnailData.backgroundColor',
    ],
  );

  // Load thumbnail functions on client side only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (thumbnailFunctionsRef.current) return;

    loadThumbnailFunctions()
      .then((funcs) => {
        thumbnailFunctionsRef.current = funcs;
        // Trigger a re-render to use the loaded functions
        setFunctionsLoaded(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load thumbnail functions:', error);
      });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match the container size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.width / (1280 / 768);

    return () => {
      if (drawRequest.current) {
        cancelAnimationFrame(drawRequest.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!thumbnailFunctionsRef.current || !functionsLoaded) {
      setLoading(true);
      return;
    }

    setLoading(true);

    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    // Clear previous draw requests
    if (drawRequest.current) {
      cancelAnimationFrame(drawRequest.current);
    }

    const { drawNotesOffscreen, swap } = thumbnailFunctionsRef.current;

    drawRequest.current = requestAnimationFrame(async () => {
      try {
        const output = await drawNotesOffscreen({
          notes,
          startTick,
          startLayer,
          zoomLevel,
          backgroundColor,
          canvasWidth: canvas.width,
          imgWidth: 1280,
          imgHeight: 768,
        });

        swap(output, canvas);
        setLoading(false);
      } catch (error) {
        console.error('Error drawing thumbnail:', error);
        setLoading(false);
      }
    });
  }, [
    notes,
    startTick,
    startLayer,
    zoomLevel,
    backgroundColor,
    functionsLoaded,
  ]);

  return (
    <div className='relative w-full'>
      <canvas
        ref={canvasRef}
        className='w-full h-full aspect-[5/3] rounded-lg'
      />
      {loading && (
        <div className='absolute top-0 flex items-center justify-center bg-black w-full h-full rounded-lg opacity-80'>
          Loading...
        </div>
      )}
    </div>
  );
};
