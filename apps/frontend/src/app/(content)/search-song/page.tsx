'use client';

import {
  faEllipsis,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongPreviewDtoType } from '@nbw/database';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import LoadMoreButton from '@web/modules/browse/components/client/LoadMoreButton';
import SongCard from '@web/modules/browse/components/SongCard';
import SongCardGroup from '@web/modules/browse/components/SongCardGroup';

// Mock data for testing
const mockSongs: SongPreviewDtoType[] = [
  {
    publicId: '1',
    uploader: {
      username: 'musicmaker',
      profileImage: '/img/note-block-pfp.jpg',
    },
    title: 'Beautiful Melody',
    description: 'A peaceful song for relaxation',
    originalAuthor: 'John Doe',
    duration: 180,
    noteCount: 150,
    thumbnailUrl: '/img/note-block-grayscale.png',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    playCount: 1245,
    visibility: 'public',
  },
  {
    publicId: '2',
    uploader: {
      username: 'composer123',
      profileImage: '/img/note-block-pfp.jpg',
    },
    title: 'Epic Adventure Theme',
    description: 'An exciting soundtrack for your adventures',
    originalAuthor: 'Jane Smith',
    duration: 240,
    noteCount: 320,
    thumbnailUrl: '/img/note-block-grayscale.png',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    playCount: 856,
    visibility: 'public',
  },
  {
    publicId: '3',
    uploader: {
      username: 'beatmaster',
      profileImage: '/img/note-block-pfp.jpg',
    },
    title: 'Minecraft Nostalgia',
    description: 'Classic minecraft-inspired music',
    originalAuthor: 'C418',
    duration: 195,
    noteCount: 280,
    thumbnailUrl: '/img/note-block-grayscale.png',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    playCount: 2134,
    visibility: 'public',
  },
];

const SearchSongPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const [songs, setSongs] = useState<SongPreviewDtoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);

  // Mock search function
  const searchSongs = (searchQuery: string, pageNum: number) => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (pageNum === 1) {
        // Filter mock songs based on query
        const filtered = mockSongs.filter(
          (song) =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            song.originalAuthor
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            song.uploader.username
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
        setSongs(filtered);
        setHasMore(filtered.length >= limit);
      } else {
        // For pagination, just add duplicates with modified IDs for demo
        const additionalSongs = mockSongs.slice(0, 2).map((song, index) => ({
          ...song,
          publicId: `${song.publicId}-page-${pageNum}-${index}`,
          title: `${song.title} (Page ${pageNum})`,
        }));
        setSongs((prev) => [...prev, ...additionalSongs]);
        setHasMore(pageNum < 3); // Mock: only show 3 pages max
      }
      setLoading(false);
    }, 500);
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchSongs(query, nextPage);
  };

  useEffect(() => {
    setCurrentPage(page);
    searchSongs(query, page);
  }, [query, page]);

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
          <h1 className='text-2xl font-bold'>Search Results</h1>
          {query && (
            <p className='text-zinc-400'>
              {songs.length > 0
                ? `Found ${songs.length} songs for "${query}"`
                : `No songs found for "${query}"`}
            </p>
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
