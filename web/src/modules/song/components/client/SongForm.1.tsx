import { UploadConst } from '@shared/validation/song/constants';
import { useUploadSongProviderType } from '@web/src/modules/upload/components/client/context/UploadSong.context';
import { Input, Option, Select } from './FormElements';
import InstrumentPicker from './InstrumentPicker';
import { SongThumbnailInput } from './SongThumbnailInput';
import { ErrorBalloon } from '../../../shared/components/client/ErrorBalloon';
import { useSongProvider } from '../../../song/components/client/context/Song.context';
import type { useEditSongProviderType } from '../../../song-edit/components/client/context/EditSong.context';
import { SongFormProps } from './SongForm';

export const SongForm = ({ type, isLocked = false }: SongFormProps) => {
  const useSongProviderData = useSongProvider(
    type,
  ) as useUploadSongProviderType & useEditSongProviderType;
  const { sendError, errors, submitSong, song, isSubmitting } =
    useSongProviderData;
  const formMethods = useSongProviderData.formMethods;
  const { register } = useSongProviderData;
  return (
    <>
      <form
        className='flex flex-col gap-6'
        onSubmit={formMethods.handleSubmit(() => {
          submitSong();
        })}
      >
        {sendError && (
          <ErrorBalloon message={sendError} isVisible={!!sendError} />
        )}
        <div className='flex flex-col h-fit gap-6'>
          {/* Title */}
          <div>
            <label htmlFor='name'>Title*</label>
            <Input
              disabled={isLocked}
              invalid={!!errors.title}
              {...register('title', {
                disabled: isLocked,
              })}
            />
            <ErrorBalloon
              message={errors.title?.message}
              isVisible={!!errors.title}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor='description'>Description</label>

            <textarea
              id='description'
              className={`block h-48 w-full rounded-lg bg-transparent border-2 ${
                errors.description ? 'border-red-500' : 'border-zinc-500'
              } p-2`}
              {...register('description', {
                disabled: isLocked,
              })}
            ></textarea>

            <ErrorBalloon
              message={errors.description?.message}
              isVisible={!!errors.description}
            />
          </div>

          {/* Author */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <label htmlFor='artist'>Author</label>
              <Input
                type='text'
                id='artist'
                disabled={true}
                className='block'
                invalid={!!errors.artist}
                {...register('artist', {
                  disabled: true, // TODO: This will be enabled in the future when the feature is implemented
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

          {/* Genre */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <label htmlFor='category'>Category</label>

              <Select
                {...register('category', {
                  disabled: isLocked,
                })}
                invalid={!!errors.category}
              >
                {Object.entries(UploadConst.categories).map(
                  ([key, value]: [string, string]) => (
                    <Option key={key} value={key}>
                      {value}
                    </Option>
                  ),
                )}
              </Select>

              <ErrorBalloon
                message={errors.category?.message}
                isVisible={!!errors.category}
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div className='flex-1'>
            <p>Thumbnail</p>
            <div className='flex justify-center w-full rounded-lg border-2 border-zinc-500 p-8 mb-4'>
              {song && <SongThumbnailInput type={type} />}
            </div>
          </div>

          {/* Visibility */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <label htmlFor='visibility'>Visibility</label>

              <Select
                invalid={!!errors.visibility}
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

              <ErrorBalloon
                message={errors.visibility?.message}
                isVisible={!!errors.visibility}
              />
            </div>
            <div className='flex-1'>
              <label htmlFor='license'>License</label>
              <Select
                invalid={!!errors.license}
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
              <ErrorBalloon
                message={errors.license?.message}
                isVisible={!!errors.license}
              />
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
            <input
              type='checkbox'
              className='accent-blue scale-150 mr-3'
              disabled
              {...register('allowDownload', {
                disabled: true, // TODO: This will be enabled in the future when the feature is implemented
              })}
            />
            <label htmlFor='allowDownload'>
              Allow other users to download the NBS file{' '}
              <span className='text-zinc-400 italic'>(Coming soon!)</span>
            </label>
            <ErrorBalloon
              message={errors.allowDownload?.message}
              isVisible={!!errors.allowDownload}
            />
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
