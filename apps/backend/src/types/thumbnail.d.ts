declare module '@nbw/thumbnail/node' {
  interface DrawParams {
    notes: unknown;
    startTick: number;
    startLayer: number;
    zoomLevel: number;
    backgroundColor: string;
    imgWidth: number;
    imgHeight: number;
  }

  export function drawToImage(params: DrawParams): Promise<Buffer>;
  export function drawNotesOffscreen(params: DrawParams): Promise<unknown>;
}
