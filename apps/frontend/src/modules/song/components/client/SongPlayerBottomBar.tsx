'use client';

import {
  faChevronUp,
  faCirclePause,
  faCirclePlay,
  faClose,
  faRepeat,
  faVolumeHigh,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@web/lib/utils';
import { Slider } from '@web/modules/shared/components/ui/slider';
import { formatDuration } from '@web/modules/shared/util/format';

import { useSongPlayer } from './context/SongPlayer.context';

const RENDER_WIDTH = 1280;
const RENDER_HEIGHT = 768;
const PLAYER_BAR_HEIGHT_VAR = '--song-player-bar-height';

const clearPlayerBarHeight = () => {
  document.documentElement.style.removeProperty(PLAYER_BAR_HEIGHT_VAR);
};

export function SongPlayerBottomBar() {
  const router = useRouter();
  const barRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrubbingRef = useRef(false);
  const [tick, setTick] = useState(0);
  const [lengthTicks, setLengthTicks] = useState(0);
  const {
    registerDockMount,
    togglePlayback,
    seek,
    subscribeToSeek,
    isLooping,
    toggleLoop,
    volume,
    setVolume,
    stopPlayback,
    isLoading,
    loadingPhase,
    error,
    currentSong,
    isPlaying,
    isSongRoute,
  } = useSongPlayer();

  const isVisible = !!currentSong && !isSongRoute;
  const duration = currentSong?.stats.duration ?? 0;
  const progress =
    lengthTicks > 0 ? Math.min(1, Math.max(0, tick / lengthTicks)) : 0;
  const currentTime = duration * progress;

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

  useLayoutEffect(() => {
    if (!isVisible) {
      clearPlayerBarHeight();
      return;
    }

    const node = barRef.current;
    if (!node) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        PLAYER_BAR_HEIGHT_VAR,
        `${node.getBoundingClientRect().height}px`,
      );
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(node);

    return () => {
      observer.disconnect();
      clearPlayerBarHeight();
    };
  }, [isVisible]);

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
  }, [applyScale, isVisible]);

  useEffect(() => {
    requestAnimationFrame(() => {
      applyScale();
    });
  }, [applyScale, currentSong?.publicId, isVisible]);

  useEffect(() => {
    setTick(0);
    setLengthTicks(0);

    return subscribeToSeek((event) => {
      if (isScrubbingRef.current) return;
      setTick(event.tick);
      setLengthTicks(event.totalLength);
    });
  }, [currentSong?.publicId, subscribeToSeek]);

  const expandSong = () => {
    if (!currentSong) return;
    router.push(`/song/${currentSong.publicId}`);
  };

  return (
    <div
      ref={barRef}
      aria-hidden={!isVisible}
      className={cn(
        'fixed bottom-0 left-0 z-10 w-full flex justify-center items-center bg-zinc-900/90 backdrop-blur-md border-t border-zinc-700',
        isVisible ? '' : 'invisible pointer-events-none',
      )}
    >
      <div className='w-full max-w-(--breakpoint-xl) px-3 sm:px-6 h-24 flex items-center gap-3'>
        {/* Miniplayer */}
        <div className='relative h-20 shrink-0 rounded-md overflow-hidden aspect-5/3'>
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
          <button
            type='button'
            onClick={expandSong}
            className='absolute inset-0'
            aria-label='Open song page'
            title='Open song'
          />
        </div>

        {/* Song title and artist */}
        <button
          type='button'
          onClick={expandSong}
          className='min-w-0 max-w-48 hidden sm:flex flex-col text-left group'
        >
          <span className='text-md font-semibold text-zinc-100 truncate w-full group-hover:underline'>
            {currentSong?.title ?? ''}
          </span>
          <span className='text-sm text-zinc-400 truncate w-full group-hover:underline'>
            {currentSong ? currentSong.uploader.username : ''}
          </span>
        </button>

        {/* Loading/error message display */}
        {isLoading ? (
          <span className='text-xs text-zinc-400 truncate hidden md:inline'>
            {loadingPhase}
          </span>
        ) : null}
        {error ? (
          <span className='text-xs text-red-300 truncate hidden md:inline'>
            {error}
          </span>
        ) : null}

        {/* Play/Pause button */}
        <button
          type='button'
          onClick={() => togglePlayback()}
          className='text-zinc-200 hover:text-zinc-100 text-3xl hover:scale-110 transition-transform shrink-0'
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <FontAwesomeIcon icon={isPlaying ? faCirclePause : faCirclePlay} />
        </button>

        {/* Loop button */}
        <button
          type='button'
          onClick={() => toggleLoop()}
          className={cn(
            'h-8 w-8 shrink-0 text-zinc-400 hover:text-zinc-100 transition-colors',
            isLooping && 'text-blue-400 hover:text-blue-300',
          )}
          aria-label={isLooping ? 'Disable loop' : 'Enable loop'}
          aria-pressed={isLooping}
          title={isLooping ? 'Loop on' : 'Loop off'}
        >
          <FontAwesomeIcon icon={faRepeat} className='text-lg' />
        </button>

        <div className='grid flex-1 self-stretch grid-rows-[1fr_auto_1fr] min-w-0 gap-1'>
          {/* Playback progress */}
          <Slider
            min={0}
            max={lengthTicks > 0 ? lengthTicks : 1}
            step={1}
            value={[lengthTicks > 0 ? tick : 0]}
            disabled={!currentSong || lengthTicks <= 0}
            onValueChange={(value) => {
              isScrubbingRef.current = true;
              setTick(value[0] ?? 0);
            }}
            onValueCommit={(value) => {
              seek(value[0] ?? 0);
              isScrubbingRef.current = false;
            }}
            className='min-w-16 w-full row-2'
            aria-label='Playback progress'
          />

          {/* Current time */}
          <div className='row-3 self-start justify-self-start text-sm tabular-nums text-zinc-400 w-fit'>
            <span className='font-semibold'>{`${formatDuration(
              currentTime,
            )}`}</span>
            {` / ${formatDuration(duration)}`}
          </div>
        </div>

        <div className='flex items-center gap-1 shrink-0'>
          {/* Volume button */}
          <div className='relative group'>
            <button
              type='button'
              onClick={() => setVolume(volume > 0 ? 0 : 1)}
              className='h-8 w-8 text-zinc-400 hover:text-zinc-100 transition-colors'
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
              title='Volume'
            >
              <FontAwesomeIcon
                icon={volume === 0 ? faVolumeXmark : faVolumeHigh}
                className='text-lg'
              />
            </button>
            <div className='absolute bottom-full left-1/2 -translate-x-1/2 pb-3 pt-2 px-2 hidden group-hover:flex group-focus-within:flex flex-col items-center'>
              <div className='h-32 px-4 py-3 rounded-md bg-zinc-700 drop-shadow-md'>
                <Slider
                  orientation='vertical'
                  min={0}
                  max={1}
                  step={0.01}
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0] ?? 0)}
                  aria-label='Volume'
                  className=''
                />
              </div>
            </div>
          </div>

          {/* Expand button (open song page) */}
          <button
            type='button'
            onClick={expandSong}
            className='h-8 w-8 text-zinc-400 hover:text-zinc-100 transition-colors'
            aria-label='Open song page'
            title='Open song'
          >
            <FontAwesomeIcon icon={faChevronUp} className='text-lg' />
          </button>

          {/* Stop button (close player) */}
          <button
            type='button'
            onClick={() => stopPlayback()}
            className='absolute top-4 right-4 h-4 w-4 text-zinc-400 hover:text-zinc-100 transition-colors'
            aria-label='Stop playback'
            title='Close player'
          >
            <FontAwesomeIcon icon={faClose} className='text-lg' />
          </button>
        </div>
      </div>
    </div>
  );
}
