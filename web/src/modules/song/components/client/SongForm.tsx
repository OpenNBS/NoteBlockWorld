import { UploadConst } from '@shared/validation/song/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ErrorBalloon } from '@web/src/modules/shared/components/client/ErrorBalloon';
import { ErrorBox } from '@web/src/modules/shared/components/client/ErrorBox';

import InstrumentPicker from './InstrumentPicker';
import { SongThumbnailInput } from './SongThumbnailInput';
import {
  Area,
  Checkbox,
  EditButton,
  Input,
  Option,
  Select,
  TextArea,
  UploadButton,
} from '../../../shared/components/client/FormElements';
import { useSongProvider } from '../../../song/components/client/context/Song.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faWarning } from '@fortawesome/free-solid-svg-icons';

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
      <div className='bg-yellow-700 border-yellow-300 text-yellow-300 border-2 rounded-lg px-3 py-2 text-sm'>
        <FontAwesomeIcon icon={faWarning} className='h-4 relative float-left' />
        Please make sure to review our{' '}
        <Link href='/guidelines'>Community Guidelines</Link> before uploading a
        song!
      </div>

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
              tooltip={
                <>
                  <p>
                    The title of the song (required). It&apos;s useful to add
                    the album, game, or media where the song originates from,
                    e.g. &quot;Sweden – Minecraft: Volume Alpha&quot;. Avoid
                    clickbait words or unrelated catchphrases — keep it simple!
                  </p>
                  <p>
                    <strong>Note:</strong> The title field in your song file
                    will be set to what you entered here.
                  </p>
                </>
              }
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
              tooltip={
                <>
                  <p>
                    A short description of the song. You can use this field to
                    share your creative process, inspirations, context, or even
                    why this song is meaningful to you!
                  </p>
                  <p>
                    <strong>Note:</strong> The description field in your song
                    file will be set to what you entered here.
                  </p>
                </>
              }
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
                tooltip={
                  <>
                    <p>
                      The name of the person or group who arranged or composed
                      the song. You cannot change this because, if you are
                      uploading this song, we assume you are the author! (You
                      are, aren&apos;t you?! 😅)
                    </p>
                    <p>
                      <strong>Note:</strong> The author field in your song file
                      will be set to what&apos;s in this field.
                    </p>
                  </>
                }
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
                tooltip={
                  <>
                    <p>
                      The name of the original author of the song. This is
                      useful if you are uploading a cover or arrangement of a
                      song that is not your own. If you are the original author,
                      you can leave this field blank!
                    </p>
                    <p>
                      <strong>Note:</strong> The original author field in your
                      song file will be set to what you entered here.
                    </p>
                  </>
                }
                description={"(Leave blank if it's an original song)"}
                isLoading={isLoading}
                disabled={isLocked}
                errorMessage={errors.originalAuthor?.message}
                {...register('originalAuthor')}
              />
            </div>
          </div>

          {/* Category */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <Select
                id='category'
                label='Category'
                tooltip={
                  <>
                    <p>
                      The category of the song. This will be used to group songs
                      by topics many people may have an interest in, and helps
                      users find your song.
                    </p>
                    <p>
                      Haven&apos;t found one that fits your song? You can
                      suggest a new category in our{' '}
                      <Link href='https://discord.gg/open-note-block-studio-608692895179997252'>
                        Discord server
                      </Link>
                      !
                    </p>
                  </>
                }
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
            <Area
              label='Thumbnail'
              tooltip={
                <>
                  <p>
                    Time to be creative! Pick a start tick and layer, and set
                    the zoom level to frame an interesting part of the song. You
                    can choose a background color to match your song&apos;s
                    theme or mood — or just pick your favorite color!
                  </p>
                </>
              }
              isLoading={isLoading}
            >
              <SongThumbnailInput type={type} isLocked={isLocked} />
            </Area>
          </div>

          {/* Visibility */}
          <div className='flex flex-row gap-8 justify-between'>
            <div className='flex-1'>
              <Select
                id='visibility'
                label='Visibility'
                tooltip={
                  <>
                    <p>
                      The visibility of the song. Public songs can be viewed by
                      anyone, while private songs can only be viewed by you.
                    </p>
                    <p>
                      You may change the visibility of your song at any time.
                    </p>
                  </>
                }
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
                tooltip={
                  <>
                    <p>
                      The Standard License allows us to distribute your song.
                      Alternatively, you may place it under{' '}
                      <strong>
                        <Link href='https://creativecommons.org/licenses/by-sa/4.0/deed'>
                          CC BY-SA 4.0
                        </Link>
                      </strong>
                      , a permissive license that allows anyone to share and
                      adapt your song — provided credit is attributed to you and
                      the same license is retained.
                    </p>
                    <p>
                      For more information, please check out our{' '}
                      <Link href='/terms'>Terms of Service</Link>!
                    </p>
                  </>
                }
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
              tooltip={
                <>
                  <p>
                    If your song contains custom instruments, here you may
                    assign them to any Minecraft sound file. This will be used
                    to make your song play correctly across different
                    environments.
                  </p>
                  <p>
                    We are testing a limited selection of sounds to start with.
                    If a sound file you want to use is not listed here, please
                    reach out via our{' '}
                    <Link href='https://discord.gg/open-note-block-studio-608692895179997252'>
                      Discord server
                    </Link>
                    !
                  </p>
                </>
              }
              className='p-0 border-0 mb-0'
              isLoading={isLoading}
            >
              <InstrumentPicker type={type} />
            </Area>
            <ErrorBalloon message={errors.customInstruments?.message} />
          </div>

          {/* Allow download */}
          <div className='flex-1'>
            <Checkbox
              tooltip={
                <>
                  <p>
                    Whether to make the original NBS file available for
                    download.
                  </p>
                  <p>
                    This option can&apos;t be disabled right now! In a future
                    update, you may play songs directly in your browser and
                    optionally choose to disable downloading by other users.
                  </p>
                </>
              }
              disabled
              {...register('allowDownload')}
            />
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
            {type === 'upload' ? (
              <UploadButton isDisabled={isLoading || isSubmitting} />
            ) : (
              <EditButton isDisabled={isLoading || isSubmitting} />
            )}
          </div>
        </div>
      </form>
    </>
  );
};
