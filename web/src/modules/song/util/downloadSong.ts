'use client';

import axios from '@web/src/lib/axios';

export const downloadSongFile = async (song: {
  publicId: string;
  title: string;
}) => {
  axios
    .get(`/song/${song.publicId}/download`, {
      responseType: 'blob',
      withCredentials: true,
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
