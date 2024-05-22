import { useEditSongProviderType } from '../../../song-edit/components/client/context/EditSong.context';
import { useUploadSongProviderType } from './context/UploadSong.context';
import { Input, Option, Select } from './FormElements';
import InstrumentPicker from './InstrumentPicker';
import { SongThumbnailInput } from './SongThumbnailInput';
import { ErrorBalloon } from '../../../shared/components/client/ErrorBalloon';
import { useSongProvider } from '../../../song/components/client/context/Song.context';

export const SongForm = ({ type }: { type: 'upload' | 'edit' }) => {
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
            <Input {...register('title')} invalid={!!errors.title} />
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
              {...register('description')}
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
                {...register('artist')}
              />
            </div>
            <div className='flex-1'>
              <label htmlFor='album'>Original author</label>
              <Input {...register('originalAuthor')} />
              <p className='text-sm text-zinc-500'>
                {"(Leave blank if it's an original song)"}
              </p>
            </div>
          </div>

          {/* Genre */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <label htmlFor='category'>Category</label>

              <Select {...register('category')} invalid={!!errors.category}>
                <Option value='Gaming'>Gaming</Option>
                <Option value='MoviesNTV'>Movies & TV</Option>
                <Option value='Anime'>Anime</Option>
                <Option value='Vocaloid'>Vocaloid</Option>
                <Option value='Rock'>Rock</Option>
                <Option value='Pop'>Pop</Option>
                <Option value='Electronic'>Electronic</Option>
                <Option value='Ambient'>Ambient</Option>
                <Option value='Jazz'>Jazz</Option>
                <Option value='Classical'>Classical</Option>
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
                {...register('visibility')}
              >
                <Option value='public'>Public</Option>
                <Option value='unlisted'>Unlisted</Option>
                <Option value='private'>Private</Option>
              </Select>

              <ErrorBalloon
                message={errors.visibility?.message}
                isVisible={!!errors.visibility}
              />
            </div>
            <div className='flex-1'>
              <label htmlFor='license'>License</label>
              <Select invalid={!!errors.license} {...register('license')}>
                <Option value='no_license'>No license</Option>
                <Option value='cc_by_4'>Creative Commons CC BY 4.0</Option>
                <Option value='public_domain'>Public domain</Option>
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
              {...register('allowDownload')}
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
                  {type === 'upload' ? 'Uploading song...' : 'Updating song...'}
                </p>
              </div>
            )}

            {/* Upload button */}
            <button
              type='submit'
              className='w-32 p-3 font-semibold bg-blue-500 enabled:hover:bg-blue-400 uppercase rounded-lg disabled:opacity-50'
              disabled={isSubmitting}
            >
              {type === 'upload' ? 'Upload' : 'Update'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
