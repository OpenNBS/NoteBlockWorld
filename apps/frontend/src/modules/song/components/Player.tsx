'use client';

import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useEffect, useCallback } from 'react';

import { useSongPlayer } from './client/context/SongPlayer.context';

const RENDER_WIDTH = 1280;
const RENDER_HEIGHT = 768;

export const PlayerComponent = ({
  song,
  children,
}: {
  song: { publicId: string };
  children: React.ReactNode;
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    registerMount,
    loadSong,
    togglePlayback,
    isLoading,
    loadingPhase,
    error,
  } = useSongPlayer();

  const mountRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      registerMount(node);
    },
    [registerMount],
  );

  useEffect(() => {
    loadSong(song.publicId);
  }, [loadSong, song.publicId]);

  useEffect(() => {
    if (!viewportRef.current || !containerRef.current) return;

    const applyScale = () => {
      if (!viewportRef.current || !containerRef.current) return;

      const viewportWidth = viewportRef.current.clientWidth;
      const viewportHeight = viewportRef.current.clientHeight;
      const scale = Math.min(
        viewportWidth / RENDER_WIDTH,
        viewportHeight / RENDER_HEIGHT,
      );

      containerRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    applyScale();

    const observer = new ResizeObserver(() => {
      applyScale();
    });

    observer.observe(viewportRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        aspectRatio: '5 / 3',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'inherit',
      }}
    >
      <div
        ref={viewportRef}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: 'inherit',
        }}
      >
        <div
          ref={mountRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${RENDER_WIDTH}px`,
            height: `${RENDER_HEIGHT}px`,
            transform: 'translate(-50%, -50%) scale(1)',
            transformOrigin: 'center center',
            borderRadius: 'inherit',
            overflow: 'hidden',
          }}
        />
      </div>
      {isLoading ? (
        <div
          style={{ position: 'absolute', inset: 0, borderRadius: 'inherit' }}
        >
          <div>{loadingPhase}</div>
          {children}
        </div>
      ) : null}
      {error ? (
        <div
          style={{ position: 'absolute', inset: 0, borderRadius: 'inherit' }}
        >
          Error: {error}
        </div>
      ) : null}
      <button
        type='button'
        onClick={() => {
          togglePlayback();
        }}
        style={{
          position: 'absolute',
          left: '12px',
          bottom: '12px',
          width: '32px',
          height: '32px',
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.35)',
          background: 'rgba(0,0,0,0.55)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          cursor: 'pointer',
        }}
        aria-label='Play song'
        title='Play'
      >
        <FontAwesomeIcon icon={faPlay} className='text-xs' />
      </button>
    </div>
  );
};
