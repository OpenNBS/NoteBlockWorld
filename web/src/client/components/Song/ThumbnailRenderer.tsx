import type { Note } from '@web/src/utils/thumbnailDrawer';
import drawNotes from '@web/src/utils/thumbnailDrawer';
import React, { useState, useEffect, useRef } from 'react';

interface ThumbnailRendererProps {
  notes: Note[];
}

const bgColors = [
  '#77172e',
  '#692b17',
  '#7C4A03',
  '#264D3B',
  '#0C625D',
  '#256377',
  '#284255',
  '#472E5B',
  '#6C394F',
  '#4B443A',
  '#232427',
];

const ThumbnailRenderer = ({ notes }: ThumbnailRendererProps) => {
  const [zoomLevel, setZoomLevel] = useState(3);
  const [startTick, setStartTick] = useState(0);
  const [startLayer, setStartLayer] = useState(0);
  const canvasRef = useRef(null);

  const maxTick = Math.max(...notes.map((note) => note.tick));
  const maxLayer = Math.max(...notes.map((note) => note.layer));

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    const clampedStartTick = Math.min(Math.max(startTick, 0), maxTick);
    const clampedStartLayer = Math.min(Math.max(startLayer, 0), maxLayer);

    drawNotes(canvas, notes, clampedStartTick, clampedStartLayer, zoomLevel);
  }, [startTick, startLayer, zoomLevel, maxTick, maxLayer]);

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(Number(event.target.value));
  };

  const handleStartTickChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartTick(Number(event.target.value));
  };

  const handleStartLayerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartLayer(Number(event.target.value));
  };

  return (
    <>
      <div className='w-full grid grid-cols-[max-content_auto_7%] gap-y-2 gap-x-3 items-center align-middle'>
        <div>
          <label>Zoom Level</label>
        </div>
        <div>
          <input
            type='range'
            min='1'
            max='5'
            value={zoomLevel}
            onChange={handleZoomChange}
            className='w-full'
          />
        </div>
        <div>{zoomLevel}</div>

        <div>
          <label>Start Tick</label>
        </div>
        <div className='w-full'>
          <input
            type='range'
            min='0'
            max={maxTick}
            value={startTick}
            onChange={handleStartTickChange}
            className='w-full'
          />
        </div>
        <div>{startTick}</div>

        <div>
          <label>Start Layer</label>
        </div>
        <div className='w-full'>
          <input
            type='range'
            min='0'
            max={maxLayer}
            value={startLayer}
            onChange={handleStartLayerChange}
            className='w-full'
          />
        </div>
        <div>{startLayer}</div>
      </div>

      {/* Background Color */}
      <div className='w-full flex flex-col gap-2'>
        <label>Background Color</label>
        <div className='w-full flex flex-row flex-wrap gap-1.5 justify-center'>
          {bgColors.map((color, index) => (
            <button
              type='button'
              key={index}
              className={`w-6 h-6 rounded-full flex-none border-2 border-white border-opacity-30`}
              style={{ backgroundColor: color }}
              onClick={(e) => console.log(color)}
            ></button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className={'w-full rounded-lg'}></canvas>
    </>
  );
};

export default ThumbnailRenderer;
