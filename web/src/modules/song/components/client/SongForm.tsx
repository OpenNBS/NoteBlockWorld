import { UploadConst } from '@shared/validation/song/constants';
import { useRouter } from 'next/navigation';

import { ErrorBalloon } from '@web/src/modules/shared/components/client/ErrorBalloon';
import { ErrorBox } from '@web/src/modules/shared/components/client/ErrorBox';

import InstrumentPicker from './InstrumentPicker';
import { SongThumbnailInput } from './SongThumbnailInput';
import {
  Area,
  Checkbox,
  Input,
  Option,
  Select,
  TextArea,
} from '../../../shared/components/client/FormElements';
import { useSongProvider } from '../../../song/components/client/context/Song.context';

type SongFormProps = {
  type: 'upload' | 'edit';
  isLoading?: boolean;
  isLocked?: boolean;
};

export const SongForm = ({
  type,
  isLoading = false,
  isLocked = false,
}: SongFormProps) => {
  const useSongProviderData = useSongProvider(type);

  const { sendError, errors, submitSong, isSubmitting, formMethods, register } =
    useSongProviderData;

  const router = useRouter();

  return (
    <>
      <form
        className={`flex flex-col gap-6`}
        onSubmit={formMethods.handleSubmit(() => {
          submitSong();
        })}
      >
        <div className='flex flex-col h-fit gap-12'>
          {/* Title */}
          <div>
            <Input
              id='title'
              label='Title*'
              isLoading={isLoading}
              disabled={isLocked}
              errorMessage={errors.title?.message}
              {...register('title')}
            />
          </div>

          {/* Description */}
          <div>
            <TextArea
              id='description'
              label='Description'
              isLoading={isLoading}
              disabled={isLocked}
              errorMessage={errors.description?.message}
              {...register('description')}
            />
          </div>

          {/* Author */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <Input
                id='author'
                label='Author'
                isLoading={isLoading}
                disabled={true}
                errorMessage={errors.author?.message}
                {...register('author')}
              />
            </div>
            <div className='flex-1'>
              <Input
                id='originalAuthor'
                label='Original author'
                isLoading={isLoading}
                disabled={isLocked}
                {...register('originalAuthor')}
              />
              <p className='text-sm text-zinc-500'>
                {"(Leave blank if it's an original song)"}
              </p>
              {/* TODO: make this into a composable component: <Input.Description>, <Input.Label> etc. */}
            </div>
          </div>

          {/* Category */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <Select
                id='category'
                label='Category'
                isLoading={isLoading}
                disabled={isLocked}
                errorMessage={errors.category?.message}
                {...register('category')}
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
            <Area label='Thumbnail' isLoading={isLoading}>
              <SongThumbnailInput type={type} isLocked={isLocked} />
            </Area>
          </div>

          {/* Visibility */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <Select
                id='visibility'
                label='Visibility'
                isLoading={isLoading}
                disabled={isLocked}
                errorMessage={errors.visibility?.message}
                {...register('visibility')}
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
              <Select
                id='license'
                label='License'
                isLoading={isLoading}
                disabled={isLocked}
                errorMessage={errors.license?.message}
                {...register('license')}
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
            <Area
              label='Custom instruments'
              className='p-0 border-0 mb-0'
              isLoading={isLoading}
            >
              <InstrumentPicker type={type} />
            </Area>
            <ErrorBalloon message={errors.customInstruments?.message} />
          </div>

          {/* Allow download */}
          <div className='flex-1'>
            <Checkbox disabled {...register('allowDownload')} />
            <label htmlFor='allowDownload'>
              Allow other users to download the NBS file{' '}
              <span className='text-zinc-400 italic'>(Coming soon!)</span>
            </label>
          </div>

          {sendError && <ErrorBox message={sendError} />}

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

            {/* Cancel button (only on edit form) */}
            {type === 'edit' && (
              <button
                type='button'
                className='w-32 p-3 bg-zinc-700 enabled:hover:bg-zinc-600 uppercase rounded-lg disabled:opacity-50'
                onClick={() => router.back()}
                disabled={isLoading || isSubmitting}
              >
                Cancel
              </button>
            )}

            {/* Upload button */}
            <button
              type='submit'
              className='w-32 p-3 font-semibold bg-blue-500 enabled:hover:bg-blue-400 uppercase rounded-lg disabled:opacity-50'
              disabled={isLoading || isSubmitting}
            >
              {type === 'upload' ? 'Upload' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
