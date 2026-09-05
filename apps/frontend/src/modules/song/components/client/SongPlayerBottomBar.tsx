'use client';

import { faExpand, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

import { formatDuration } from '@web/modules/shared/util/format';

import { useSongPlayer } from './context/SongPlayer.context';

const RENDER_WIDTH = 1280;
const RENDER_HEIGHT = 768;

export function SongPlayerBottomBar() {
  const router = useRouter();
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    registerDockMount,
    togglePlayback,
    isLoading,
    loadingPhase,
    error,
    currentSong,
    isPlaying,
    isSongRoute,
  } = useSongPlayer();

  const isVisible = !!currentSong && !isSongRoute;

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
      registerDockMount(node);

      if (node) {
        requestAnimationFrame(() => {
          applyScale();
        });
      }
    },
    [applyScale, registerDockMount],
  );

  useEffect(() => {
    if (!isVisible || !viewportRef.current || !containerRef.current) return;

    applyScale();

    const observer = new ResizeObserver(() => {
      applyScale();
    });

    observer.observe(viewportRef.current);

    return () => {
      observer.disconnect();
    };
  }, [applyScale, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    requestAnimationFrame(() => {
      applyScale();
    });
  }, [applyScale, currentSong?.publicId, isVisible]);

  return (
    <div
      aria-hidden={!isVisible}
      className={`sticky bottom-0 left-0 z-10 w-[calc(100vw-16px)] flex justify-center items-center bg-zinc-900/70 backdrop-blur-md border-t border-zinc-700 py-3 ${
        isVisible ? '' : 'hidden'
      }`}
    >
      <div className='w-full max-w-(--breakpoint-xl) px-6 sm:px-10 flex items-center gap-3'>
        <div className='relative w-44 max-w-[38vw] aspect-5/3 rounded-lg overflow-hidden bg-zinc-800'>
          <div ref={viewportRef} className='absolute inset-0 overflow-hidden'>
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
                overflow: 'hidden',
              }}
            />
          </div>
        </div>

        <div className='min-w-0 grow'>
          <div className='text-sm font-semibold text-zinc-100 truncate'>
            {currentSong?.title ?? ''}
          </div>
          <div className='text-xs text-zinc-400 truncate'>
            {currentSong
              ? `${currentSong.uploader.username} · ${formatDuration(
                  currentSong.stats.duration,
                )}`
              : ''}
          </div>
          {isLoading ? (
            <div className='text-xs text-zinc-400 mt-1'>{loadingPhase}</div>
          ) : null}
          {error ? (
            <div className='text-xs text-red-300 mt-1'>{error}</div>
          ) : null}
        </div>

        <button
          type='button'
          onClick={() => {
            togglePlayback();
          }}
          className='h-9 w-9 rounded-full border border-zinc-600 text-zinc-100 hover:bg-zinc-800 transition-colors'
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <FontAwesomeIcon
            icon={isPlaying ? faPause : faPlay}
            className='text-xs'
          />
        </button>

        <button
          type='button'
          onClick={() => {
            if (!currentSong) return;
            router.push(`/song/${currentSong.publicId}`);
          }}
          className='inline-flex items-center gap-2 h-9 rounded-md border border-zinc-600 px-3 text-sm text-zinc-100 hover:bg-zinc-800 transition-colors'
        >
          <FontAwesomeIcon icon={faExpand} className='text-xs' />
          Expand
        </button>
      </div>
    </div>
  );
}
