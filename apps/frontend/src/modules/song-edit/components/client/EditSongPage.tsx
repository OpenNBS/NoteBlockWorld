import { UploadSongDtoType } from '@nbw/database';
import axiosInstance from '@web/lib/axios';
import {
  getTokenServer,
  getUserData,
} from '@web/modules/auth/features/auth.utils';
import { ErrorBox } from '@web/modules/shared/components/client/ErrorBox';
import { SongProvider } from '@web/modules/song/components/client/context/Song.context';
import {
  DownloadFileButton,
  FileDisplay,
} from '@web/modules/song/components/client/FileDisplay';

import { SongEditForm } from './SongEditForm';

async function fetchSong({ id }: { id: string }): Promise<UploadSongDtoType> {
  // get token from cookies
  const token = await getTokenServer();
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
  const songId = id;
  let songData, userData;
  let username;

  try {
    songData = await fetchSong({ id });
    userData = await getUserData();
    username = userData?.username;
  } catch (error) {
    return <ErrorBox message='Failed to retrieve song data' />;
  }

  return (
    <div className='p-8 h-full w-full flex justify-center'>
      <div className='w-[75vw] max-w-[768px]'>
        <div className='flex flex-row justify-between items-center gap-12 mb-10'>
          <h1 className='flex-1 text-3xl font-bold text-nowrap truncate'>
            <span className='font-light'>Editing </span>
            {songData.title}
          </h1>
          {/* TODO: This should be the file's original name, which is not sent in the DTO */}
          <FileDisplay fileName={`${songData.title}.nbs`}>
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
}
