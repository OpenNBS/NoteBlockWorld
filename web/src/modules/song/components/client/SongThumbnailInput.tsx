import { bgColors, getThumbnailNotes } from '@shared/features/thumbnail';
import { ThumbnailConst } from '@shared/validation/song/constants';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { useUploadSongProviderType } from '@web/src/modules/upload/components/client/context/UploadSong.context';

import { useSongProvider } from './context/Song.context';
import { EditSongForm, UploadSongForm } from './SongForm.zod';
import { ThumbnailRendererCanvas } from './ThumbnailRenderer';
import type { useEditSongProviderType } from '../../../song-edit/components/client/context/EditSong.context';

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
            max: ThumbnailConst.MAX_ZOOM_LEVEL,
            disabled: isLocked,
          })}
          disabled={isLocked}
          min={ThumbnailConst.DEFAULT_ZOOM_LEVEL}
          max={ThumbnailConst.MAX_ZOOM_LEVEL}
        />
      </div>
      <div>{zoomLevel}</div>
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
            disabled: isLocked,
          })}
          disabled={isLocked}
          min={ThumbnailConst.DEFAULT_START_TICK}
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
          min={ThumbnailConst.DEFAULT_START_LAYER}
          max={maxLayer}
        />
      </div>
      <div>{startLayer}</div>
    </div>
  );
}

const ColorButton = ({
  color,
  onClick,
  disabled,
}: {
  color: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
}) => (
  <button
    type='button'
    className='w-6 h-6 rounded-full flex-none border-2 border-white border-opacity-30 disabled:opacity-30'
    style={{ backgroundColor: color }}
    disabled={disabled}
    onClick={onClick}
  />
);

export const SongThumbnailInput = ({
  type,
  isLocked,
}: {
  type: 'upload' | 'edit';
  isLocked: boolean;
}) => {
  const { song, formMethods } = useSongProvider(
    type,
  ) as useUploadSongProviderType & useEditSongProviderType;

  const [notes, maxTick, maxLayer] = useMemo(() => {
    if (!song) return [[], 0, 0];
    const notes = getThumbnailNotes(song);
    const maxTick = Math.max(...notes.map((note) => note.tick));
    const maxLayer = Math.max(...notes.map((note) => note.layer));
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

      <ThumbnailRendererCanvas notes={notes} formMethods={formMethods} />

      {/* Background Color */}
      <div className='flex flex-row flex-wrap justify-between items-center w-full gap-2'>
        <label className='basis-full sm:basis-auto'>Background Color</label>
        <div className='flex flex-row flex-wrap gap-1.5 justify-center w-full md:w-fit'>
          {bgColors.map((data: any, index) => (
            <ColorButton
              key={index}
              color={data.dark}
              disabled={isLocked}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                formMethods.setValue(
                  'thumbnailData.backgroundColor',
                  data.dark,
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
