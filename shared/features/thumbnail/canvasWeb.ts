  // Browser environment
  const createCanvas = (width: number, height: number) => {
    const canvas = new OffscreenCanvas(width, height);
    return canvas;
  };

  const loadImage = function (src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const getPath = (filename: string) => {
    return filename;
  };

  const saveToImage = (canvas: HTMLCanvasElement) => {
    console.log('Not implemented in browser');
  };

  const noteBlockImage = loadImage(getPath('/img/note-block-grayscale.png'));

  const useFont = () => {
    const f = new FontFace('Lato', 'url(/fonts/Lato-Regular.ttf)');
    f.load().then((font) => {
      document.fonts.add(font);
    });
  };

  useFont();

  const Canvas = HTMLCanvasElement;
  const Image = HTMLImageElement;

let content  = {
    createCanvas,
    loadImage,
    getPath,
    saveToImage,
    noteBlockImage,
    useFont,
    Canvas,
    Image,
};


export {
    Canvas,
    Image, createCanvas, getPath, loadImage, noteBlockImage, saveToImage, useFont
};

