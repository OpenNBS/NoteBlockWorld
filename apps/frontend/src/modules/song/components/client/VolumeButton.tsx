import {
  faVolume,
  faVolumeOff,
  faVolumeLow,
  faVolumeXmark,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Slider } from '@web/modules/shared/components/ui/slider';

import { useSongPlayer } from './context/SongPlayer.context';

/** 
A button that allows the user to adjust the volume of the currently playing song.
Behavior:
- Hovering over the button will show a popup slider to adjust the volume.
- Clicking the button while not muted will enable the mute state, also triggerable by dragging the slider to 0.
- Clicking the button while muted will restore the volume to the last non-muted volume (either
the slider's value when the button was clicked, or the value before it was dragged to 0).
*/
export const VolumeButton = () => {
  const { volume, setVolume, toggleMute } = useSongPlayer();

  const getVolumeIcon = (volume: number | 'mute') => {
    if (volume === 'mute' || volume === 0) return faVolumeXmark;
    if (volume <= 0.33) return faVolumeOff;
    if (volume <= 0.67) return faVolumeLow;
    if (volume <= 0.95) return faVolume;
    return faVolumeHigh;
  };

  return (
    <div className='relative group'>
      <button
        type='button'
        onClick={() => toggleMute()}
        className='h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:scale-110 active:scale-95 transition-all'
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        title='Volume'
      >
        <FontAwesomeIcon icon={getVolumeIcon(volume)} className='text-lg' />
      </button>
      <div className='absolute bottom-full left-1/2 -translate-x-1/2 pb-3 pt-2 px-2 hidden group-hover:flex group-focus-within:flex flex-col items-center'>
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
            className=''
          />
        </div>
      </div>
    </div>
  );
};
