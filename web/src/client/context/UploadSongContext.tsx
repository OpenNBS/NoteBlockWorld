'use client';

import { createContext, useContext, useState } from 'react';
import { getTokenLocal } from '../utils/tokenUtils';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import axiosInstance from '@web/src/axios';
import { Song } from '@encode42/nbs.js';

type CoverData = {
  zoomLevel: number;
  startTick: number;
  startLayer: number;
  backgroundColor: string;
};

type UploadSongForm = {
  allowDownload: boolean;
  visibility: 'public' | 'private'; // Use a string literal type if the visibility can only be 'public' or 'private'
  title: string;
  originalAuthor: string;
  description: string;
  coverData: CoverData;
  customInstruments: string[];
};

type UploadSongContextType = {
  song: Song | null;
  setSong: (songFile: Song | null) => void;
  formMethods: UseFormReturn<UploadSongForm>;
  submitSong: () => void;
};

const UploadSongContext = createContext<UploadSongContextType>(
  null as unknown as UploadSongContextType
);

export const UploadSongProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [song, setSong] = useState<Song | null>(null);
  const formMethods = useForm<UploadSongForm>({
    defaultValues: {
      allowDownload: false,
      visibility: 'public',
      title: '',
      originalAuthor: '',
      description: '',
      coverData: {
        zoomLevel: 1,
        startTick: 0,
        startLayer: 0,
        backgroundColor: '#000000',
      },
      customInstruments: [],
    },
  });

  const submitSongData = async (): Promise<void | never> => {
    const token = getTokenLocal();
    const response = await axiosInstance.post(
      '/song',
      {
        ...formMethods.getValues(),
        coverData: JSON.stringify(formMethods.getValues().coverData),
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      console.log('Song data submitted successfully');
    } else {
      throw new Error('Song data submission failed');
    }
  };
  const submitSongSongFile = async (): Promise<void | never> => {
    if (!song) return;

    const token = getTokenLocal();
    const formData = new FormData();
    formData.append('file', new Blob([song?.toArrayBuffer()]), song?.meta.name);
    const response = await axiosInstance.post('/song/upload_song', formData, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 200) {
      console.log('Song file submitted successfully');
    } else {
      throw new Error('Song file submission failed');
    }
  };

  const submitSong = async () => {
    try {
      await submitSongData();
      await submitSongFile();
    } catch (e) {
      console.error(e);
    }
  };

  const setSongHandler = (songFile: Song | null) => {
    if (!songFile) return;
    setSong(songFile);
    const { name, description, originalAuthor } = songFile.meta;
    formMethods.setValue('title', name);
    formMethods.setValue('description', description);
    formMethods.setValue('originalAuthor', originalAuthor);
  };

  return (
    <UploadSongContext.Provider
      value={{ submitSong, song, setSong: setSongHandler, formMethods }}
    >
      {children}
    </UploadSongContext.Provider>
  );
};

export const useUploadSongProvider = () => {
  const context = useContext(UploadSongContext);
  if (context === undefined || context === null) {
    throw new Error(
      'useUploadSongProvider must be used within a UploadSongProvider'
    );
  }
  return context;
};
