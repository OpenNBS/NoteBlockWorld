'use client';

import { toast } from 'react-hot-toast';

import axios from '@web/lib/axios';
import { getTokenLocal } from '@web/lib/axios/token.utils';

export const downloadSongFile = async (song: {
  publicId: string;
  title   : string;
}) => {
  const token = getTokenLocal();

  axios
    .get(`/song/${song.publicId}/download`, {
      params: {
        src: 'downloadButton'
      },
      headers: {
        authorization: `Bearer ${token}`
      },
      responseType   : 'blob',
      withCredentials: true
    })
    .then((res) => {
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', `${song.title}.nbs`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    });
};

export const openSongInNBS = async (song: { publicId: string }) => {
  axios
    .get(`/song/${song.publicId}/open`, {
      headers: {
        src: 'downloadButton'
      }
    })
    .then((response) => {
      const responseUrl = response.data;
      const nbsUrl = 'nbs://' + responseUrl;

      // Create a link element and click it to open the song in NBS
      const link = document.createElement('a');
      link.href = nbsUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(nbsUrl);
    })
    .catch(() => {
      toast.error('Failed to open song in NBS');
    });
};
