'use client';

import { PageQueryDTOType } from '@shared/validation/common/dto/types';
import {
  SongPreviewDtoType,
  TimespanType,
} from '@shared/validation/song/dto/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import axiosInstance from '@web/src/lib/axios';

type HomePageContextType = {
  recentSongs: SongPreviewDtoType[];
  fetchRecentSongs: () => void;
  recentLoading: boolean;
  recentError: string;
  featuredSongs: SongPreviewDtoType[];
  fetchFeaturedSongs: () => void;
  featuredLoading: boolean;
  featuredError: string;
  featuredTimespan: TimespanType;
  setFeaturedTimespan: (timespan: TimespanType) => void;
  timespan: TimespanType;
  setTimespan: (timespan: TimespanType) => void;
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
  initialRecentSongs: SongPreviewDtoType[];
  initialFeaturedSongs: SongPreviewDtoType[];
}) => {
  // Recent songs
  const [recentSongs, setRecentSongs] =
    useState<SongPreviewDtoType[]>(initialRecentSongs);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState<string>('');

  // Featured songs
  const [featuredSongs, setFeaturedSongs] =
    useState<SongPreviewDtoType[]>(initialFeaturedSongs);
  const [featuredTimespan, setFeaturedTimespan] =
    useState<TimespanType>('week');
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState<string>('');
  const [timespan, setTimespan] = useState<TimespanType>('week');

  const fetchRecentSongs = useCallback(async () => {
    // setRecentLoading(true);
    const params: PageQueryDTOType = {
      page: 1, // TODO: fiz constants
      limit: 10,
      sort: 'createdAt',
      order: false,
      timespan: featuredTimespan,
    };
    try {
      const response = await axiosInstance.get('/song', {
        params,
      });
      setRecentSongs([...recentSongs, ...response.data]);
    } catch (error) {
      setRecentError('Error loading recent songs');
    } finally {
      setRecentLoading(false);
    }
  }, [featuredTimespan, recentSongs]);

  const fetchFeaturedSongs = useCallback(async () => {
    //setFeaturedLoading(true);
    const params: PageQueryDTOType = {
      page: 1, // TODO: fiz constants
      limit: 10,
      sort: 'playCount',
      order: false,
      timespan: featuredTimespan,
    };
    try {
      const response = await axiosInstance.get('/song', {
        params,
      });
      setFeaturedSongs([...featuredSongs, ...response.data]);
      //console.log('featuredSongs', featuredSongs);
      //console.log('response.data', response.data);
    } catch (error) {
      setFeaturedError('Error loading featured songs');
    } finally {
      setFeaturedLoading(false);
    }
  }, [featuredSongs, featuredTimespan]);

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
        timespan,
        setTimespan,
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
