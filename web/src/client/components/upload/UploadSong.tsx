'use client';

import { fromArrayBuffer } from '@encode42/nbs.js';
import { faFileAudio } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import { styled } from 'styled-components';
import {
  UploadSongProvider,
  useUploadSongProvider,
} from '../../context/UploadSongContext';
import ThumbnailRenderer from '@web/src/client/components/upload/ThumbnailRenderer';

const Input = styled.input.attrs({
  className:
    'block h-12 w-full rounded-lg bg-transparent border-2 border-zinc-500 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2',
})``;

const Select = styled.select.attrs({
  className:
    'block h-12 w-full rounded-lg bg-transparent border-2 border-zinc-500 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2',
})``;

const Option = styled.option.attrs({
  className: 'bg-zinc-900',
})``;

const SongSelector = () => {
  const { setSong } = useUploadSongProvider();
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const file: File = e.target.files[0];
      const song = fromArrayBuffer(await file.arrayBuffer());

      if (song.length <= 0) {
        alert('Invalid song. Please try uploading a different file!');
        return;
      }
      setSong(song, file.name);
    },
    [setSong]
  );

  const handleFileDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!e.dataTransfer.files) return;
      const file: File = e.dataTransfer.files[0];
      const song = fromArrayBuffer(await file.arrayBuffer());

      if (song.length <= 0) {
        alert('Invalid song. Please try uploading a different file!');
        return;
      }
      setSong(song, file.name);
    },
    [setSong]
  );

  return (
    <div
      className='flex flex-col items-center gap-6 h-fit border-dashed border-4 border-zinc-700 p-8 mb-4'
      onDragOver={(e) => e.preventDefault()}
    >
      <i>
        <FontAwesomeIcon
          icon={faFileAudio}
          size='5x'
          className='text-zinc-600'
        />
      </i>

      <div className='text-center'>
        <p className='font-semibold text-xl'>Drag and drop your song</p>
        <p className='text-zinc-400'>or select a file below</p>
      </div>
      <label
        htmlFor='uploadNbsFile'
        className='px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white cursor-pointer'
      >
        Select file
      </label>
      <input
        type='file'
        name='nbsFile'
        id='uploadNbsFile'
        accept='.nbs'
        className='z-[-1] absolute opacity-0'
        onChange={handleFileSelect}
        onDrop={handleFileDrop}
      />
    </div>
  );
};

const ThumbnailInput = () => {
  const { song } = useUploadSongProvider();
  if (!song) return null;
  return (
    <div>
      <p>Thumbnail</p>
      <div className='flex flex-col items-center gap-6 w-full rounded-lg border-2 border-zinc-500 p-8 mb-4'>
        <ThumbnailRenderer
          notes={song.layers
            .map((layer) =>
              layer.notes.map((note, tick) => {
                const data = {
                  tick: tick,
                  layer: layer.id,
                  key: note.key,
                  instrument: note.instrument,
                };
                return data;
              })
            )
            .flat()}
        ></ThumbnailRenderer>
      </div>
    </div>
  );
};

const UploadForm = () => {
  const { formMethods, submitSong, song } = useUploadSongProvider();
  return (
    <form
      className='flex flex-col gap-6'
      onSubmit={formMethods.handleSubmit(() => {
        submitSong();
      })}
    >
      <div className='flex flex-col h-fit gap-6'>
        {/* Title */}
        <div>
          <label htmlFor='name'>Title*</label>
          <Input
            type='text'
            className=''
            {...formMethods.register('title', {
              required: true,
              maxLength: 64,
            })}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            className='block h-48 w-full rounded-lg bg-transparent border-2 border-zinc-500 p-2'
            {...formMethods.register('description', {
              maxLength: 1024,
            })}
          ></textarea>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor='tags'>Tags</label>
          <Input type='text' name='tags' id='tags' className='block' />
          <p className='text-sm text-zinc-500'>(Separate tags with a comma)</p>
        </div>

        {/* Author */}
        <div className='flex flex-row gap-8 justify-between'>
          <div className='flex-1'>
            <label htmlFor='artist'>Author</label>
            <Input
              type='text'
              id='artist'
              value={'Replace with user name'}
              disabled={true}
              className='block'
            />
          </div>
          <div className='flex-1'>
            <label htmlFor='album'>Original author </label>
            <Input
              type='text'
              id='album'
              className='block'
              {...formMethods.register('originalAuthor', {
                maxLength: 64,
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
            <Select name='category' id='category'>
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
          </div>
          <div className='flex-1'>
            <label htmlFor='playlist'>Playlist</label>
            <Select name='playlist' id='playlist'>
              <Option value='playlist1'>None</Option>
              <Option value='playlist1'>Playlist 1</Option>
              <Option value='playlist2'>Playlist 2</Option>
              <Option value='playlist3'>Playlist 3</Option>
            </Select>
          </div>
        </div>

        {/* Thumbnail */}
        {song && <ThumbnailInput />}

        {/* Visibility */}
        <div className='flex flex-row gap-8 justify-between'>
          <div className='flex-1'>
            <label htmlFor='visibility'>Visibility</label>
            <Select id='visibility' {...formMethods.register('visibility')}>
              <Option value='public'>Public</Option>
              <Option value='public'>Unlisted</Option>
              <Option value='private'>Private</Option>
            </Select>
          </div>
          <div className='flex-1'>
            <label htmlFor='license'>License</label>
            <Select id='license'>
              <Option value='cc'>No license</Option>
              <Option value='cc'>Creative Commons CC BY 4.0</Option>
              <Option value='cc'>Public domain</Option>
            </Select>
          </div>
        </div>

        {/* Allow download */}
        <div className='flex-1'>
          <input
            type='checkbox'
            className='accent-blue scale-150 mr-3'
            id='allowDownload'
            {...formMethods.register('allowDownload')}
          />
          <label htmlFor='allowDownload'>
            Allow other users to download the NBS file
          </label>
        </div>

        <div className='h-4'></div>

        {/* Upload button */}
        <button
          type='submit'
          className='w-32 ml-auto p-3 font-semibold bg-blue-500 hover:bg-blue-400 uppercase rounded-lg'
        >
          Upload
        </button>
      </div>
    </form>
  );
};

const UploadSong = () => {
  const { song } = useUploadSongProvider();
  return <>{!song ? <SongSelector /> : <UploadForm />}</>;
};

export const UploadSongPage = () => {
  return (
    <UploadSongProvider>
      <UploadSong />
    </UploadSongProvider>
  );
};
