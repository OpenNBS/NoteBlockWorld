import { UploadConst } from '@shared/validation/song/constants';

import { useUploadSongProviderType } from '@web/src/modules/upload/components/client/context/UploadSong.context';

import { Checkbox, Input, Option, Select, TextArea } from './FormElements';
import InstrumentPicker from './InstrumentPicker';
import { SongThumbnailInput } from './SongThumbnailInput';
import { ErrorBalloon } from '../../../shared/components/client/ErrorBalloon';
import { useSongProvider } from '../../../song/components/client/context/Song.context';
import type { useEditSongProviderType } from '../../../song-edit/components/client/context/EditSong.context';

type SongFormProps = {
  type: 'upload' | 'edit';
  isLocked?: boolean;
};

export const SongForm = ({ type, isLocked = false }: SongFormProps) => {
  const useSongProviderData = useSongProvider(
    type,
  ) as useUploadSongProviderType & useEditSongProviderType;
  const { sendError, errors, submitSong, isSubmitting, formMethods, register } =
    useSongProviderData;

  return (
    <>
      <form
        className='flex flex-col gap-6'
        onSubmit={formMethods.handleSubmit(() => {
          submitSong();
        })}
      >
        {sendError && <ErrorBalloon message={sendError} />}
        <div className='flex flex-col h-fit gap-12'>
          {/* Title */}
          <div>
            <label htmlFor='name'>Title*</label>
            <Input
              disabled={isLocked}
              errorMessage={errors.title?.message}
              {...register('title', {
                disabled: isLocked,
              })}
            />
            <ErrorBalloon message={errors.title?.message} />
          </div>

          {/* Description */}
          <div>
            <label htmlFor='description'>Description</label>

            <TextArea
              errorMessage={errors.description?.message}
              {...register('description', {
                disabled: isLocked,
              })}
            />
          </div>

          {/* Author */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <label htmlFor='author'>Author</label>
              <Input
                type='text'
                id='author'
                disabled={true}
                errorMessage={errors.author?.message}
                {...register('author', {
                  disabled: true,
                })}
              />
            </div>
            <div className='flex-1'>
              <label htmlFor='album'>Original author</label>
              <Input
                {...register('originalAuthor', {
                  disabled: isLocked,
                })}
              />
              <p className='text-sm text-zinc-500'>
                {"(Leave blank if it's an original song)"}
              </p>
            </div>
          </div>

          {/* Category */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <label htmlFor='category'>Category</label>

              <Select
                {...register('category', {
                  disabled: isLocked,
                })}
                errorMessage={errors.category?.message}
              >
                {Object.entries(UploadConst.categories).map(
                  ([key, value]: [string, string]) => (
                    <Option key={key} value={key}>
                      {value}
                    </Option>
                  ),
                )}
              </Select>
            </div>
          </div>

          {/* Thumbnail */}
          <div className='flex-1'>
            <p>Thumbnail</p>
            <div className='flex justify-center w-full rounded-lg border-2 border-zinc-500 p-8 mb-4'>
              <SongThumbnailInput type={type} isLocked={isLocked} />
            </div>
          </div>

          {/* Visibility */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <label htmlFor='visibility'>Visibility</label>

              <Select
                errorMessage={errors.visibility?.message}
                id='visibility'
                {...register('visibility', {
                  disabled: isLocked,
                })}
              >
                {Object.entries(UploadConst.visibility).map(
                  ([key, value]: [string, string]) => (
                    <Option key={key} value={key}>
                      {value}
                    </Option>
                  ),
                )}
              </Select>
            </div>
            <div className='flex-1'>
              <label htmlFor='license'>License</label>
              <Select
                errorMessage={errors.license?.message}
                {...register('license', {
                  disabled: isLocked,
                })}
              >
                {Object.entries(UploadConst.licenses).map(
                  ([key, value]: [string, string]) => (
                    <Option key={key} value={key}>
                      {value}
                    </Option>
                  ),
                )}
              </Select>
            </div>
          </div>

          <div className='flex-1'>
            <label htmlFor='custom-instruments'>Custom instruments</label>
            <div className='flex justify-center w-full rounded-lg border-2 border-zinc-500 p-8 mb-4'>
              <InstrumentPicker type={type} />
            </div>
          </div>

          {/* Allow download */}
          <div className='flex-1'>
            <Checkbox
              disabled
              {...register('allowDownload', {
                disabled: true, // TODO: This will be enabled in the future when the feature is implemented
              })}
            />
            <label htmlFor='allowDownload'>
              Allow other users to download the NBS file{' '}
              <span className='text-zinc-400 italic'>(Coming soon!)</span>
            </label>
          </div>

          <div className='h-4'></div>

          <div className='flex flex-row items-center justify-end gap-8'>
            {/* Uploading label */}
            {isSubmitting && (
              <div className='flex flex-row items-center justify-center gap-2'>
                <span className='loader'></span>
                <p className='text-center'>
                  {type === 'upload' ? 'Uploading song...' : 'Saving song...'}
                </p>
              </div>
            )}

            {/* Upload button */}
            <button
              type='submit'
              className='w-32 p-3 font-semibold bg-blue-500 enabled:hover:bg-blue-400 uppercase rounded-lg disabled:opacity-50'
              disabled={isSubmitting}
            >
              {type === 'upload' ? 'Upload' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
