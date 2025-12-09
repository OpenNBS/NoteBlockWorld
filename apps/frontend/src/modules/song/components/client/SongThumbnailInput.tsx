import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { BG_COLORS, THUMBNAIL_CONSTANTS } from '@nbw/config';
import { cn, oklchToRgb } from '@web/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@web/modules/shared/components/tooltip';

import { useSongProvider } from './context/Song.context';
import { EditSongForm, UploadSongForm } from './SongForm.zod';
import { ThumbnailRendererCanvas } from './ThumbnailRenderer';
import { Slider } from '@web/modules/shared/components/ui/slider';

const formatZoomLevel = (zoomLevel: number) => {
  const percentage = 100 * Math.pow(2, zoomLevel - 3);
  return `${percentage}%`;
};

type ThumbnailSlidersProps = {
  formMethods: UseFormReturn<UploadSongForm> & UseFormReturn<EditSongForm>;
  isLocked: boolean;
  maxTick: number;
  maxLayer: number;
};

const ThumbnailSliders: React.FC<ThumbnailSlidersProps> = ({
  formMethods,
  isLocked,
  maxTick,
  maxLayer,
}) => {
  const { setValue } = formMethods;

  const [zoomLevel, startTick, startLayer] = formMethods.watch([
    'thumbnailData.zoomLevel',
    'thumbnailData.startTick',
    'thumbnailData.startLayer',
  ]);

  return (
    <div className='w-full grid grid-cols-[max-content_auto_7%] gap-y-2 gap-x-3 items-center align-middle'>
      <div>
        <label htmlFor='zoom-level'>Zoom Level</label>
      </div>
      <div>
        <Slider
          id='zoom-level'
          value={[zoomLevel]}
          onValueChange={(value) => {
            setValue('thumbnailData.zoomLevel', value[0], {
              shouldValidate: true,
            });
          }}
          className='w-full'
          disabled={isLocked}
          min={THUMBNAIL_CONSTANTS.zoomLevel.min}
          max={THUMBNAIL_CONSTANTS.zoomLevel.max}
        />
      </div>
      <div>{formatZoomLevel(zoomLevel)}</div>
      <div>
        <label htmlFor='start-tick'>Start Tick</label>
      </div>
      <div className='w-full'>
        <Slider
          id='start-tick'
          value={[startTick]}
          onValueChange={(value) => {
            setValue('thumbnailData.startTick', value[0], {
              shouldValidate: true,
            });
          }}
          className='w-full'
          disabled={isLocked}
          min={THUMBNAIL_CONSTANTS.startTick.default}
          max={maxTick}
        />
      </div>
      <div>{startTick}</div>
      <div>
        <label htmlFor='start-layer'>Start Layer</label>
      </div>
      <div className='w-full'>
        <Slider
          id='start-layer'
          value={[startLayer]}
          onValueChange={(value) => {
            setValue('thumbnailData.startLayer', value[0], {
              shouldValidate: true,
            });
          }}
          className='w-full'
          disabled={isLocked}
          min={THUMBNAIL_CONSTANTS.startLayer.default}
          max={maxLayer}
        />
      </div>
      <div>{startLayer}</div>
    </div>
  );
};

type ColorButtonProps = {
  color: string;
  tooltip: string;
  active: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
};

const ColorButton: React.FC<ColorButtonProps> = ({
  color,
  tooltip,
  active,
  onClick,
  disabled,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type='button'
        className={cn(
          'w-6 h-6 rounded-full flex-none border-2 border-zinc-200 border-opacity-30 disabled:opacity-30',
          active && 'outline outline-2 outline-zinc-200',
        )}
        style={{ backgroundColor: color }}
        disabled={disabled}
        onClick={onClick}
      />
    </TooltipTrigger>
    <TooltipContent className='text-center'>{tooltip}</TooltipContent>
  </Tooltip>
);

type SongThumbnailInputProps = {
  type: 'upload' | 'edit';
  isLocked: boolean;
};

export const SongThumbnailInput: React.FC<SongThumbnailInputProps> = ({
  type,
  isLocked,
}) => {
  const { song, formMethods } = useSongProvider(type);

  const [notes, maxTick, maxLayer] = useMemo(() => {
    if (!song) return [null, 0, 0];
    const notes = song.notes;
    const maxTick = song.length;
    const maxLayer = song.height;

    return [notes, maxTick, maxLayer];
  }, [song]);

  return (
    <div className='flex flex-col items-center gap-6 w-full max-w-lg'>
      <ThumbnailSliders
        formMethods={formMethods}
        isLocked={isLocked}
        maxTick={maxTick}
        maxLayer={maxLayer}
      />

      {song && notes && (
        <ThumbnailRendererCanvas notes={notes} formMethods={formMethods} />
      )}

      {/* Background Color */}
      <div className='flex flex-row flex-wrap justify-between items-center w-full gap-2'>
        <label className='basis-full sm:basis-auto'>Background Color</label>
        <div className='flex flex-row flex-wrap gap-1.5 justify-center w-full md:w-fit'>
          {Object.entries(BG_COLORS).map(([key, { name, dark }], index) => (
            <ColorButton
              key={index}
              color={dark}
              tooltip={name}
              disabled={isLocked}
              active={
                formMethods.watch('thumbnailData.backgroundColor') === dark
              }
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                formMethods.setValue(
                  'thumbnailData.backgroundColor',
                  oklchToRgb(dark),
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
