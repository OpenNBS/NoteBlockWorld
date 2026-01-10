'use client';

import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { THUMBNAIL_CONSTANTS } from '@nbw/config';
import { NoteQuadTree } from '@nbw/song';
import { drawNotesOffscreen, swap } from '@nbw/thumbnail/browser';

import { UploadSongFormInput } from './SongForm.zod';

type ThumbnailRendererCanvasProps = {
  notes: NoteQuadTree;
  formMethods: UseFormReturn<UploadSongFormInput>;
};

export const ThumbnailRendererCanvas = ({
  notes,
  formMethods,
}: ThumbnailRendererCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    setLoading(true);

    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    // Clear previous draw requests
    if (drawRequest.current) {
      cancelAnimationFrame(drawRequest.current);
    }

    drawRequest.current = requestAnimationFrame(async () => {
      try {
        const output = (await drawNotesOffscreen({
          notes,
          startTick: startTick ?? THUMBNAIL_CONSTANTS.startTick.default,
          startLayer: startLayer ?? THUMBNAIL_CONSTANTS.startLayer.default,
          zoomLevel: zoomLevel ?? THUMBNAIL_CONSTANTS.zoomLevel.default,
          backgroundColor:
            backgroundColor ?? THUMBNAIL_CONSTANTS.backgroundColor.default,
          canvasWidth: canvas.width,
          imgWidth: 1280,
          imgHeight: 768,
        })) as OffscreenCanvas;

        swap(output, canvas);
        setLoading(false);
      } catch (error) {
        console.error('Error drawing thumbnail:', error);
        setLoading(false);
      }
    });
  }, [notes, startTick, startLayer, zoomLevel, backgroundColor]);

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
