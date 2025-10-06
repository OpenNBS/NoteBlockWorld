'use client';

import {
  faEllipsis,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongPreviewDtoType } from '@nbw/database';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import axiosInstance from '@web/lib/axios';
import LoadMoreButton from '@web/modules/browse/components/client/LoadMoreButton';
import SongCard from '@web/modules/browse/components/SongCard';
import SongCardGroup from '@web/modules/browse/components/SongCardGroup';

interface PageDto<T> {
  content: T[];
  page: number;
  limit: number;
  total: number;
}

const SearchSongPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'recent';
  const order = searchParams.get('order') || 'desc';
  const category = searchParams.get('category') || '';
  const uploader = searchParams.get('uploader') || '';
  const initialPage = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const [songs, setSongs] = useState<SongPreviewDtoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalResults, setTotalResults] = useState(0);

  // Fetch songs from the API
  const searchSongs = async (searchQuery: string, pageNum: number) => {
    setLoading(true);

    try {
      const params: Record<string, any> = {
        page: pageNum,
        limit,
        sort,
        order,
      };

      if (searchQuery) {
        params.q = searchQuery;
      }

      if (category) {
        params.category = category;
      }

      if (uploader) {
        params.uploader = uploader;
      }

      const response = await axiosInstance.get<PageDto<SongPreviewDtoType>>(
        '/song',
        { params },
      );

      if (pageNum === 1) {
        // First page - replace songs
        setSongs(response.data.content);
      } else {
        // Load more - append songs
        setSongs((prev) => [...prev, ...response.data.content]);
      }

      setTotalResults(response.data.total);
      // Check if there are more pages to load
      setHasMore(response.data.content.length >= limit);
    } catch (error) {
      console.error('Error searching songs:', error);
      setSongs([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchSongs(query, nextPage);
  };

  useEffect(() => {
    setCurrentPage(initialPage);
    searchSongs(query, initialPage);
  }, [query, sort, order, category, uploader, initialPage]);

  if (loading && songs.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center gap-4 mb-6'>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className='text-2xl text-zinc-400'
          />
          <h1 className='text-2xl font-bold'>Searching...</h1>
        </div>
        <SongCardGroup>
          {Array.from({ length: 6 }).map((_, i) => (
            <SongCard key={i} song={null} />
          ))}
        </SongCardGroup>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Search header */}
      <div className='flex items-center gap-4 mb-6'>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className='text-2xl text-zinc-400'
        />
        <div>
          <h1 className='text-2xl font-bold'>
            {query ? 'Search Results' : 'Browse Songs'}
          </h1>
          {query && (
            <p className='text-zinc-400'>
              {songs.length > 0
                ? `Found ${totalResults} song${
                    totalResults !== 1 ? 's' : ''
                  } for "${query}"`
                : `No songs found for "${query}"`}
            </p>
          )}
          {!query && songs.length > 0 && (
            <p className='text-zinc-400'>
              Showing {songs.length} of {totalResults} songs
            </p>
          )}
          {/* Active filters */}
          {(category || uploader) && (
            <div className='flex flex-wrap gap-2 mt-2'>
              {category && (
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-300'>
                  Category: {category}
                </span>
              )}
              {uploader && (
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-300'>
                  By: {uploader}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {songs.length > 0 ? (
        <>
          <SongCardGroup>
            {songs.map((song, i) => (
              <SongCard key={`${song.publicId}-${i}`} song={song} />
            ))}
          </SongCardGroup>

          {/* Load more / End indicator */}
          <div className='flex flex-col w-full justify-between items-center mt-4'>
            {loading ? (
              <div className='text-zinc-400'>Loading more songs...</div>
            ) : hasMore ? (
              <LoadMoreButton onClick={loadMore} />
            ) : (
              <FontAwesomeIcon
                icon={faEllipsis}
                className='text-2xl text-zinc-500'
              />
            )}
          </div>
        </>
      ) : !loading ? (
        <div className='text-center py-12 text-zinc-400'>
          <FontAwesomeIcon icon={faMagnifyingGlass} className='text-4xl mb-4' />
          <h2 className='text-xl mb-2'>No songs found</h2>
          <p>
            Try adjusting your search terms or browse our featured songs
            instead.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchSongPage;
