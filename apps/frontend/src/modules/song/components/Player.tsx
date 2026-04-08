'use client';

import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PianoRollView, Player, Viewer } from '@opennbs/nbsvis';
import { useRef, useEffect, useState, useCallback } from 'react';

import { getSongOpenUrl } from '../util/downloadSong';

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
  const isCancelledRef = useRef(false);
  const viewerRef = useRef<Viewer | null>(null);
  const playerRef = useRef<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPhase, setLoadingPhase] = useState('Preparing player...');
  const [error, setError] = useState<string | null>(null);

  const loadSong = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingPhase('Preparing player...');

      if (!containerRef.current) {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );
      }

      if (!containerRef.current) {
        throw new Error('Player container not ready');
      }

      if (isCancelledRef.current || !containerRef.current) return;

      if (!viewerRef.current || !playerRef.current) {
        setLoadingPhase('Initializing viewer...');
        const viewer = new Viewer(containerRef.current);

        await viewer.init();
        await viewer.setView(new PianoRollView());

        // Render at a fixed internal resolution; CSS transform scales it to fit.
        viewer.resize(RENDER_WIDTH, RENDER_HEIGHT);

        if (isCancelledRef.current) return;

        const player = new Player(viewer, {
          audioEngine: {
            urlBase: `${window.location.origin}/`,
          },
        });

        viewerRef.current = viewer;
        playerRef.current = player;
      }

      if (!playerRef.current) {
        throw new Error('Player initialization failed');
      }

      setLoadingPhase('Loading song data...');

      const songUrl = await getSongOpenUrl({ publicId: song.publicId });
      await Promise.resolve(playerRef.current.loadSong(songUrl));
    } catch (err) {
      if (!isCancelledRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load song');
      }
    } finally {
      if (!isCancelledRef.current) setIsLoading(false);
    }
  }, [song.publicId]);

  useEffect(() => {
    isCancelledRef.current = false;

    loadSong();

    return () => {
      isCancelledRef.current = true;
    };
  }, [loadSong]);

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
          ref={containerRef}
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
          playerRef.current?.togglePlayback();
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
