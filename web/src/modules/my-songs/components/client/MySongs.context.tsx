'use client';

import axiosInstance from '@web/src/lib/axios';
import { useRouter } from 'next/router';
import { createContext, useContext } from 'react';

export type MySongsSongDTO = {
  id: string;
  thumbnail: ImageData;
  title: string;
  description: string;
  author: string;
  originalAuthor: string;
  noteCount: number;
  duration: string;
  filename: string;
  rawFile: Blob;
  createdAt: string;
  updatedAt: string;
  playCount: number;
  visibility: 'public' | 'private';
};

type MySongsContextType = {
  getSongs: () => Promise<MySongsSongDTO[]>;
  editSong: (id: string) => void;
};

const MySongsContext = createContext<MySongsContextType>(
  {} as MySongsContextType
);

export const UploadSongProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  // TODO: should this be here or in src/modules/user/features/song.util.ts?
  const getSongs = async () => {
    const response = await axiosInstance.get('/songs');
    const data = response.data as MySongsSongDTO[];
    return data;
  };

  const editSong = (id: string) => {
    router.push(`/song/${id}/edit`);
  };

  return (
    <MySongsContext.Provider value={{ getSongs, editSong }}>
      {children}
    </MySongsContext.Provider>
  );
};

export const useMySongsProvider = () => {
  const context = useContext(MySongsContext);
  if (context === undefined || context === null) {
    throw new Error('useMySongsProvider must be used within a MySongsProvider');
  }
  return context;
};
