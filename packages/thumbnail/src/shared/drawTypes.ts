export interface DrawContext2D {
  imageSmoothingEnabled: boolean;
  fillStyle: string | CanvasGradient | CanvasPattern;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  globalCompositeOperation: string;
  globalAlpha: number;
  scale(x: number, y: number): void;
  clearRect(x: number, y: number, w: number, h: number): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  drawImage(
    image: ImageLike,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ): void;
  fillText(text: string, x: number, y: number): void;
}

export interface ImageLike {
  width: number;
  height: number;
}

export interface DrawingCanvas {
  width: number;
  height: number;
  getContext(type: '2d'): DrawContext2D;
}
