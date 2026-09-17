'use client';

import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useEffect, useCallback } from 'react';

import {
  type PlayingSong,
  useSongPlayer,
} from './client/context/SongPlayer.context';

const RENDER_WIDTH = 1280;
const RENDER_HEIGHT = 768;

export const PlayerComponent = ({
  song,
  children,
}: {
  song: PlayingSong;
  children: React.ReactNode;
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    registerPageMount,
    loadSong,
    togglePlayback,
    isLoading,
    loadingPhase,
    error,
    currentSong,
    isPlaying,
    isSongRoute,
  } = useSongPlayer();

  const applyScale = useCallback(() => {
    if (!viewportRef.current || !containerRef.current) return;

    const viewportWidth = viewportRef.current.clientWidth;
    const viewportHeight = viewportRef.current.clientHeight;
    const scale = Math.min(
      viewportWidth / RENDER_WIDTH,
      viewportHeight / RENDER_HEIGHT,
    );

    containerRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }, []);

  const mountRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      registerPageMount(node);

      if (node) {
        requestAnimationFrame(() => {
          applyScale();
        });
      }
    },
    [applyScale, registerPageMount],
  );

  useEffect(() => {
    void loadSong(song);
    // Only load when this page's song changes. Reloading on loadSong identity
    // would overwrite a different song started from a card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.publicId]);

  useEffect(() => {
    if (!viewportRef.current || !containerRef.current) return;

    applyScale();

    const observer = new ResizeObserver(() => {
      applyScale();
    });

    observer.observe(viewportRef.current);

    return () => {
      observer.disconnect();
    };
  }, [applyScale]);

  useEffect(() => {
    requestAnimationFrame(() => {
      applyScale();
    });
  }, [applyScale, currentSong?.publicId, isSongRoute]);

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
        aria-label={isPlaying ? 'Pause song' : 'Play song'}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        <FontAwesomeIcon
          icon={isPlaying ? faPause : faPlay}
          className='text-xs'
        />
      </button>
    </div>
  );
};
