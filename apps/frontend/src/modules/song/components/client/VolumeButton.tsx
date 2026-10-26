'use client';

import {
  faVolume,
  faVolumeOff,
  faVolumeLow,
  faVolumeXmark,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useId, useState } from 'react';

import { cn } from '@web/lib/utils';
import { Slider } from '@web/modules/shared/components/ui/slider';

import { useSongPlayer } from './context/SongPlayer.context';

/**
 * Mute toggle + hover/focus popup slider for the song player.
 *
 * - Hover or focus reveals the slider (kept in the DOM so the thumb is focusable).
 * - Click mutes / unmutes; slider drag to 0 also mutes with restore-on-unmute.
 * - Tab from the mute button into the slider, then use arrow keys to change volume.
 */
export const VolumeButton = () => {
  const { volume, setVolume, toggleMute } = useSongPlayer();
  const sliderId = useId();
  const [isOpen, setIsOpen] = useState(false);

  const getVolumeIcon = (volume: number | 'mute') => {
    if (volume === 'mute' || volume === 0) return faVolumeXmark;
    if (volume <= 0.33) return faVolumeOff;
    if (volume <= 0.67) return faVolumeLow;
    if (volume <= 0.95) return faVolume;
    return faVolumeHigh;
  };

  const volumePercent = Math.round(volume * 100);

  return (
    <div
      className='relative'
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) {
          setIsOpen(false);
        }
      }}
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type='button'
        onClick={() => toggleMute()}
        className='h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:scale-110 active:scale-95 transition-all'
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        aria-expanded={isOpen}
        aria-controls={sliderId}
        title='Volume'
      >
        <FontAwesomeIcon icon={getVolumeIcon(volume)} className='text-lg' />
      </button>
      <div
        id={sliderId}
        inert={!isOpen ? true : undefined}
        aria-hidden={!isOpen}
        className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 pb-3 pt-2 px-2 flex flex-col items-center transition-opacity',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
      >
        <div className='h-32 px-4 py-3 rounded-md bg-zinc-700 drop-shadow-md'>
          <Slider
            orientation='vertical'
            min={0}
            max={1}
            step={0.01}
            value={[volume]}
            onPointerDown={() => {
              // Freeze unmute target at the level before this drag/press.
              if (volume > 0) {
                setVolume(volume);
              }
            }}
            onValueChange={(value) =>
              setVolume(value[0] ?? 0, { rememberAudible: false })
            }
            onValueCommit={(value) => {
              const next = value[0] ?? 0;
              // Remember the settled level only when still audible; if muted,
              // keep the pre-press level from onPointerDown.
              setVolume(next, { rememberAudible: next > 0 });
            }}
            aria-label='Volume'
            aria-valuetext={`${volumePercent}%`}
            className='h-full'
          />
        </div>
      </div>
    </div>
  );
};
