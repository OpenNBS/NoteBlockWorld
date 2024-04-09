'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import axiosInstance from '@web/src/lib/axios';

import { FeaturedTimespan, SongPreview } from '../../types';

type HomePageContextType = {
  recentSongs: SongPreview[];
  fetchRecentSongs: () => void;
  recentLoading: boolean;
  recentError: string;
  featuredSongs: SongPreview[];
  fetchFeaturedSongs: () => void;
  featuredLoading: boolean;
  featuredError: string;
  featuredTimespan: FeaturedTimespan;
  setFeaturedTimespan: (timespan: FeaturedTimespan) => void;
};

const HomePageContext = createContext<HomePageContextType>(
  {} as HomePageContextType,
);

export const HomePageProvider = ({
  children,
  initialRecentSongs,
  initialFeaturedSongs,
}: {
  children: React.ReactNode;
  initialRecentSongs: SongPreview[];
  initialFeaturedSongs: SongPreview[];
}) => {
  // Recent songs
  const [recentSongs, setRecentSongs] =
    useState<SongPreview[]>(initialRecentSongs);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState<string>('');

  // Featured songs
  const [featuredSongs, setFeaturedSongs] =
    useState<SongPreview[]>(initialFeaturedSongs);
  const [featuredTimespan, setFeaturedTimespan] =
    useState<FeaturedTimespan>('week');
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState<string>('');

  const fetchRecentSongs = useCallback(async () => {
    // setRecentLoading(true);
    try {
      const response = await axiosInstance.get('/song', {
        params: { sort: 'recent', skip: recentSongs.length, limit: 8 },
      });
      setRecentSongs(response.data);
    } catch (error) {
      setRecentError('Error loading recent songs');
    } finally {
      setRecentLoading(false);
    }
  }, [recentSongs]);

  const fetchFeaturedSongs = useCallback(async () => {
    //setFeaturedLoading(true);
    try {
      const response = await axiosInstance.get('/song', {
        params: {
          sort: 'recent', // TODO: featured
          // TODO: featuredTimespan,
          skip: featuredSongs.length,
          limit: 12,
        },
      });
      setFeaturedSongs({ ...featuredSongs, ...response.data });
    } catch (error) {
      setFeaturedError('Error loading featured songs');
    } finally {
      setFeaturedLoading(false);
    }
  }, [featuredSongs]);

  const loadPage = useCallback(async () => {
    await fetchFeaturedSongs();
    await fetchRecentSongs();
  }, [fetchFeaturedSongs, fetchRecentSongs]);

  useEffect(() => {
    async () => await loadPage();
  }, [loadPage]);

  return (
    <HomePageContext.Provider
      value={{
        recentSongs,
        fetchRecentSongs,
        recentLoading,
        recentError,
        featuredSongs,
        fetchFeaturedSongs,
        featuredLoading,
        featuredError,
        featuredTimespan,
        setFeaturedTimespan,
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
};

export const useHomePageProvider = () => {
  const context = useContext(HomePageContext);
  if (context === undefined || context === null) {
    throw new Error(
      'useHomePageProvider must be used within a HomepageProvider',
    );
  }
  return context;
};
