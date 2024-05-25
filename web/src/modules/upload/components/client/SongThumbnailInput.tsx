import { bgColors, getThumbnailNotes } from '@shared/features/thumbnail';
import { useMemo } from 'react';

import { ThumbnailRendererCanvas } from './ThumbnailRenderer';
import { useSongProvider } from '../../../song/components/client/context/Song.context';

const ColorButton = ({
  color,
  onClick,
}: {
  color: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => (
  <button
    type='button'
    className='w-6 h-6 rounded-full flex-none border-2 border-white border-opacity-30'
    style={{ backgroundColor: color }}
    onClick={onClick}
  />
);

export const SongThumbnailInput = ({ type }: { type: 'upload' | 'edit' }) => {
  const { song, register, formMethods } = useSongProvider(type);
  const [zoomLevel, startTick, startLayer, backgroundColor] = formMethods.watch(
    [
      'thumbnailData.zoomLevel',
      'thumbnailData.startTick',
      'thumbnailData.startLayer',
      'thumbnailData.backgroundColor',
    ],
  );

  const [notes, maxTick, maxLayer] = useMemo(() => {
    if (!song) return [[], 0, 0];
    const notes = getThumbnailNotes(song);
    const maxTick = Math.max(...notes.map((note) => note.tick));
    const maxLayer = Math.max(...notes.map((note) => note.layer));
    return [notes, maxTick, maxLayer];
  }, [song]);

  return (
    <div className='flex flex-col items-center gap-6 w-full max-w-lg'>
      <div className='w-full grid grid-cols-[max-content_auto_7%] gap-y-2 gap-x-3 items-center align-middle'>
        <div>
          <label htmlFor='zoom-level'>Zoom Level</label>
        </div>
        <div>
          <input
            type='range'
            id='zoom-level'
            className='w-full'
            {...register('thumbnailData.zoomLevel', {
              valueAsNumber: true,
              value: 3,
              max: 5,
            })}
            min={1}
            max={5}
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
            className='w-full'
            {...register('thumbnailData.startTick', {
              valueAsNumber: true,
              value: 0,
              max: maxTick,
            })}
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
            min='0'
            className='w-full'
            {...register('thumbnailData.startLayer', {
              valueAsNumber: true,
              value: 0,
              max: maxLayer,
            })}
            max={maxLayer}
          />
        </div>
        <div>{startLayer}</div>
      </div>

      <ThumbnailRendererCanvas notes={notes} formMethods={formMethods} />

      {/* Background Color */}
      <div className='flex flex-row flex-wrap justify-between items-center w-full gap-2'>
        <label className='basis-full sm:basis-auto'>Background Color</label>
        <div className='flex flex-row flex-wrap gap-1.5 justify-center w-full md:w-fit'>
          {bgColors.map((color, index) => (
            <ColorButton
              key={index}
              color={color}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                formMethods.setValue('thumbnailData.backgroundColor', color);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
