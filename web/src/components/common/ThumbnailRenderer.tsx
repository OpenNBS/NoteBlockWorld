import type { Note } from "@web/src/utils/thumbnailDrawer";
import drawNotes from "@web/src/utils/thumbnailDrawer";
import React, { useState, useEffect, useRef } from "react";

interface ThumbnailRendererProps {
  notes: Note[];
}

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
    <div>
      <label>
        Zoom Level:
        <input
          type="range"
          min="1"
          max="5"
          value={zoomLevel}
          onChange={handleZoomChange}
        />
        {zoomLevel}
      </label>
      <br />
      <label>
        Start Tick:
        <input
          type="range"
          min="0"
          max={maxTick}
          value={startTick}
          onChange={handleStartTickChange}
        />
        {startTick}
      </label>
      <br />
      <label>
        Start Layer:
        <input
          type="range"
          min="0"
          max={maxLayer}
          value={startLayer}
          onChange={handleStartLayerChange}
        />
        {startLayer}
      </label>
      <br />
      {<canvas ref={canvasRef} className={"w-full"}></canvas>}
    </div>
  );
};

export default ThumbnailRenderer;
