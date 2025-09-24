import type NapiRs from '@napi-rs/canvas';
import type { NoteQuadTree } from '@nbw/song';

import { DrawingCanvas, RenderedImage } from './canvasFactory';

export interface DrawParams {
  notes          : NoteQuadTree;
  startTick      : number;
  startLayer     : number;
  zoomLevel      : number;
  backgroundColor: string;
  canvasWidth?   : number;
  canvasHeight?  : number;
  imgWidth       : number;
  imgHeight      : number;
}

export type Canvas = typeof DrawingCanvas;

export type Image = typeof RenderedImage; /*
import type {
  Canvas as NapiCanvas,
  Image as NapiImage,
  GlobalFonts as NapiGlobalFonts,
} from '@napi-rs/canvas';
*/

export interface CanvasUtils {
  createCanvas(width: number, height: number): any;
  loadImage(src: string): Promise<any>;
  getPath(filename: string): string | URL;
  useFont(): void;
  saveToImage(canvas: HTMLCanvasElement | NapiRs.Canvas): Promise<Uint8Array>;
  noteBlockImage: Promise<any> | any;
  DrawingCanvas : any;
  RenderedImage : any;
}
