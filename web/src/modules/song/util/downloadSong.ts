import axios from '@web/src/lib/axios';

export const downloadSongFile = async (songId: string) => {
  axios
    .get(`/song/${songId}/download`, {
      responseType: 'blob',
      withCredentials: true,
    })
    .then((res) => {
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;

      console.log(res);

      // Get the filename from the content-disposition header
      // TODO: content-disposition header is not appearing in the response
      // (it is sent, but the browser does not expose it)
      //const contentDisposition = res.data.headers['content-disposition'];
      //const filename = contentDisposition.split('filename=')[1];

      link.setAttribute('download', 'song.nbs');
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    });
};
