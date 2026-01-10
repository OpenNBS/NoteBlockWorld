'use client';

import { Suspense } from 'react';

import { SearchSongPage } from '@web/modules/song-search/SearchSongPage';

const SearchPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchSongPage />
    </Suspense>
  );
};

export default SearchPageWrapper;
