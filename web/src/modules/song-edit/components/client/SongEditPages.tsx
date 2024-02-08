import axiosInstance from '@web/src/lib/axios';
import { getTokenServer } from '@web/src/modules/auth/features/auth.utils';

async function fetchSong({ id }: { id: string }) {
  // get token from cookies
  const token = getTokenServer();
  // if token is not null, redirect to home page
  if (!token) return {};
  if (!token.value) return {};

  try {
    const response = await axiosInstance.get(`/song?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token.value}`,
      },
    });
    const data = await response.data;
    return data;
  } catch (error: unknown) {
    console.error('Error fetching song', error);
    return {};
  }
}

export async function EditSongPage({ id }: { id: string }) {
  const song = await fetchSong({ id });
  console.log(song);
  return <h1>Edit Song {id}</h1>;
}
