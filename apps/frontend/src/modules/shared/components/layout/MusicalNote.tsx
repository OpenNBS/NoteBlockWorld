'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import './MusicalNote.css';

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

export const MusicalNote = ({ size = 4 }: MusicalNoteProps) => {
  // Initialize with a fixed value to avoid hydration mismatch
  // Then set a random value on the client side
  const [currentNote, setCurrentNote] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Set random note on client side only to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setCurrentNote(Math.floor(Math.random() * totalNotes));
  }, []);

  const noteToCell = useCallback(() => {
    const index = Math.abs(currentNote) % totalNotes;
    return {
      x: index % gridDimensions.x,
      y: Math.floor(index / gridDimensions.x),
    };
  }, [currentNote]);

  const cell = noteToCell();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = () => {
      if (ref.current) {
        ref.current.classList.remove('animate-note');
        ref.current.classList.add('animate-note-active');
        // Trigger reflow to restart the animation
        void ref.current.offsetWidth;
        ref.current.classList.add('animate-note');

        setTimeout(() => {
          ref.current?.classList.remove('animate-note-active');
        }, 500); // Match the duration of the animation

        setCurrentNote((prev) => (prev === totalNotes - 1 ? 0 : prev + 1));
      }
    };

    ref.current?.parentElement?.addEventListener('click', handleClick);

    return () => {
      ref.current?.parentElement?.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      className='musical-note animate-note-active'
      ref={ref}
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
        zIndex: 999,
        imageRendering: 'pixelated',
        cursor: 'pointer',
        position: 'absolute', // Ensure the parent element is positioned relatively
        opacity: 0,
        // disable pointer events to allow the parent element to handle the click event
        pointerEvents: 'none',
      }}
    />
  );
};
