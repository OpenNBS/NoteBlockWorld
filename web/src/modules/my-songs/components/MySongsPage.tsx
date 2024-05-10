import axiosInstance from '@web/src/lib/axios';

import { MySongProvider } from './client/MySongs.context';
import { MySongsPageComponent } from './client/MySongsTable';
import { getTokenServer } from '../../auth/features/auth.utils';
import { SongsFolder, SongsPage } from '../types';

async function fetchSongsPage(
  page: number,
  pageSize: number,
  token: string,
): Promise<SongsPage> {
  const response = await axiosInstance
    .get('/my-songs', {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        page: page,
        limit: pageSize,
        sort: 'createdAt',
        order: false,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error('Error fetching songs', error);
      return error;
    });
  return response;
}

async function fetchSongsFolder(): Promise<SongsFolder> {
  let currentPage = 0;
  const pageSize = 20;
  // get token from cookies
  const token = getTokenServer();
  // if token is null, redirect to home page

  if (!token) return {};
  if (!token.value) return {};

  try {
    console.log('fetching songs');
    const firstPage = await fetchSongsPage(currentPage, pageSize, token.value);

    // if there is a next page
    if (firstPage.total > pageSize) {
      currentPage++;
      const secondPage = await fetchSongsPage(
        currentPage,
        pageSize,
        token.value,
      );
      const data = {
        [0]: firstPage,
        [1]: secondPage,
      } as SongsFolder;
      return data;
    } else {
      const data = {
        [currentPage]: firstPage,
      };
      return data;
    }
  } catch (error: unknown) {
    console.error('Error fetching songs', error);
    return {};
  }
}

async function MySongsPage() {
  const InitialsongsFolder: SongsFolder = await fetchSongsFolder(); // TODO: this breaks the provider pagination state
  console.log('InitialsongsFolder', InitialsongsFolder);
  let totalPagesInit = 0;
  let currentPageInit = 0;
  if (InitialsongsFolder[0]) {
    totalPagesInit = InitialsongsFolder[0].total;
    currentPageInit = InitialsongsFolder[0].page;
  }
  return (
    <MySongProvider
      totalPagesInit={Math.ceil(totalPagesInit / 20)}
      currentPageInit={currentPageInit}
      pageSizeInit={20}
      InitialsongsFolder={InitialsongsFolder}
    >
      <MySongsPageComponent />
    </MySongProvider>
  );
}

export default MySongsPage;
