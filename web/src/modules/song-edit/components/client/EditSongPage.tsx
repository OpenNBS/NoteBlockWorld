import { UploadSongDtoType } from '@shared/validation/song/dto/types';

import axiosInstance from '@web/src/lib/axios';
import {
  getTokenServer,
  getUserData,
} from '@web/src/modules/auth/features/auth.utils';
import { SongProvider } from '@web/src/modules/song/components/client/context/Song.context';
import {
  DownloadFileButton,
  FileDisplay,
} from '@web/src/modules/song/components/client/FileDisplay';

import { SongEditForm } from './SongEditForm';

async function fetchSong({ id }: { id: string }): Promise<UploadSongDtoType> {
  // get token from cookies
  const token = getTokenServer();
  // if token is not null, redirect to home page
  if (!token) throw new Error('Failed to fetch song data');
  if (!token.value) throw new Error('Failed to fetch song data');

  try {
    const response = await axiosInstance.get(`/song/${id}/edit`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token.value}`,
      },
    });
    const data = await response.data;
    return data as UploadSongDtoType;
  } catch (error: unknown) {
    throw new Error('Failed to fetch song data');
  }
}

export async function EditSongPage({ id }: { id: string }) {
  try {
    const songData = await fetchSong({ id });
    const songId = id;
    const userData = await getUserData();
    const username = userData?.username;
    return (
      <div className='p-8 h-full w-full flex justify-center'>
        <div className='w-[75vw] max-w-[768px]'>
          <div className='flex flex-row justify-between items-center gap-12 mb-10'>
            <h1 className='flex-1 text-3xl font-bold text-nowrap truncate'>
              <span className='font-light'>Editing </span>
              {songData.title}
            </h1>
            <FileDisplay fileName={songData.title}>
              <DownloadFileButton
                song={{ publicId: songId, title: songData.title }}
              />
            </FileDisplay>
          </div>
          <SongProvider>
            {songData && (
              <SongEditForm
                songId={songId}
                username={username}
                songData={songData}
              />
            )}
          </SongProvider>
        </div>
      </div>
    );
  } catch (error: unknown) {
    // TODO: present better error message
    return <div>Failed to fetch song data</div>;
  }
}
