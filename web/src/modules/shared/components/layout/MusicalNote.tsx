'use client';
import { useCallback, useState } from 'react';

const notesSpritesSheet = '/notes_sprites.png';

const spritesSheetSize = {
  width: 120,
  height: 8,
};

const gridDimensions = {
  x: 24, // 24 columns
  y: 1, // 1 row
};

const singleNoteSize = {
  width: spritesSheetSize.width / gridDimensions.x,
  height: spritesSheetSize.height / gridDimensions.y,
};

const totalNotes = gridDimensions.x * gridDimensions.y;

interface MusicalNoteProps {
  size?: number;
}

export const MusicalNote = ({ size = 8 }: MusicalNoteProps) => {
  const [currentNote, setCurrentNote] = useState(0);

  const noteToCell = useCallback(() => {
    return {
      x: currentNote % gridDimensions.x,
      y: Math.floor(currentNote / gridDimensions.x),
    };
  }, [currentNote]);

  const nextNote = () => {
    setCurrentNote((currentNote + 1) % totalNotes);
  };

  const onNoteClick = () => {
    nextNote();
  };

  const cell = noteToCell();

  return (
    <div
      style={{
        width: singleNoteSize.width * size, // Scale display size
        height: singleNoteSize.height * size, // Scale display size

        backgroundImage: `url(${notesSpritesSheet})`,
        backgroundPosition: `-${cell.x * singleNoteSize.width * size}px -${
          cell.y * singleNoteSize.height * size
        }px`,
        backgroundSize: `${spritesSheetSize.width * size}px ${
          spritesSheetSize.height * size
        }px`, // Scale background

        imageRendering: 'pixelated',
        cursor: 'pointer',
      }}
      onClick={onNoteClick}
    />
  );
};
