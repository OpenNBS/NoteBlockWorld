import type { NoteQuadTree } from '@nbw/song';

export interface DrawParams {
  notes: NoteQuadTree;
  startTick: number;
  startLayer: number;
  zoomLevel: number;
  backgroundColor: string;
  canvasWidth?: number;
  canvasHeight?: number;
  imgWidth: number;
  imgHeight: number;
}
