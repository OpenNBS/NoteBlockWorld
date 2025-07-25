import { bgColorsArray } from '@nbw/thumbnail';
import { ThumbnailConst } from '@nbw/database';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { cn } from '@web/lib/tailwind.utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@web/modules/shared/components/tooltip';

import { useSongProvider } from './context/Song.context';
import { EditSongForm, UploadSongForm } from './SongForm.zod';
import { ThumbnailRendererCanvas } from './ThumbnailRenderer';

const formatZoomLevel = (zoomLevel: number) => {
  const percentage = 100 * Math.pow(2, zoomLevel - 3);
  return `${percentage}%`;
};

function ThumbnailSliders({
  formMethods,
  isLocked,
  maxTick,
  maxLayer,
}: {
  formMethods: UseFormReturn<UploadSongForm> & UseFormReturn<EditSongForm>;
  isLocked: boolean;
  maxTick: number;
  maxLayer: number;
}) {
  const { register } = formMethods;

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
        <input
          type='range'
          id='zoom-level'
          className='w-full disabled:cursor-not-allowed'
          {...register('thumbnailData.zoomLevel', {
            valueAsNumber: true,
          })}
          disabled={isLocked}
          min={ThumbnailConst.zoomLevel.min}
          max={ThumbnailConst.zoomLevel.max}
        />
      </div>
      <div>{formatZoomLevel(zoomLevel)}</div>
      <div>
        <label htmlFor='start-tick'>Start Tick</label>
      </div>
      <div className='w-full'>
        <input
          type='range'
          id='start-tick'
          className='w-full disabled:cursor-not-allowed'
          {...register('thumbnailData.startTick', {
            valueAsNumber: true,
            max: maxTick,
          })}
          disabled={isLocked}
          min={ThumbnailConst.startTick.default}
          max={maxTick}
        />
      </div>
      <div>{startTick}</div>
      <div>
        <label htmlFor='start-layer'>Start Layer</label>
      </div>
      <div className='w-full'>
        <input
          type='range'
          id='start-layer'
          className='w-full disabled:cursor-not-allowed'
          {...register('thumbnailData.startLayer', {
            valueAsNumber: true,
            max: maxLayer,
          })}
          disabled={isLocked}
          min={ThumbnailConst.startLayer.default}
          max={maxLayer}
        />
      </div>
      <div>{startLayer}</div>
    </div>
  );
}

const ColorButton = ({
  color,
  tooltip,
  active,
  onClick,
  disabled,
}: {
  color: string;
  tooltip: string;
  active: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
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

export const SongThumbnailInput = ({
  type,
  isLocked,
}: {
  type: 'upload' | 'edit';
  isLocked: boolean;
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
          {bgColorsArray.map(({ /*key,*/ name, /*light,*/ dark }, index) => (
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

                formMethods.setValue('thumbnailData.backgroundColor', dark);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
