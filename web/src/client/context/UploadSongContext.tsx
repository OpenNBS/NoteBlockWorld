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
  setSong: (songFile: Song | null, filename: string | null) => void;
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

  const submitSongData = async (): Promise<string | never> => {
    if (!song) throw new Error('Song file not found');
    console.log(song);
    const fileData = new FormData();
    const arrayBuffer = song?.toArrayBuffer();
    console.log(arrayBuffer);
    if (arrayBuffer.byteLength === 0) {
      throw new Error('Song file is empty');
    }
    const blob = new Blob([arrayBuffer]);

    fileData.append('file', blob, 'song.nbs');

    const formValues = formMethods.getValues();
    const param = {
      allowDownload: formValues.allowDownload.toString(),
      visibility: formValues.visibility.toString(),
      title: formValues.title,
      originalAuthor: formValues.originalAuthor,
      description: formValues.description,
      zoomLevel: formValues.coverData.zoomLevel.toString(),
      startTick: formValues.coverData.startTick.toString(),
      startLayer: formValues.coverData.startLayer.toString(),
      backgroundColor: formValues.coverData.backgroundColor.toString(),
      customInstruments: formValues.customInstruments.toString(),
    } as Record<string, string>;
    const query = new URLSearchParams(param);
    const token = getTokenLocal();
    const response = await axiosInstance.post(
      `/song?${query.toString()}`,
      fileData,
      {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.status === 201) {
      console.log('Song data submitted successfully');
      const data = response.data;
      console.log(data);
      const id = data._id;
      if (typeof id !== 'string') {
        throw new Error('Song data submission failed');
      }
      return id;
    } else {
      throw new Error('Song data submission failed');
    }
  };
  const submitSong = async () => {
    try {
      await submitSongData();
    } catch (e) {
      console.error(e);
    }
  };

  const setSongHandler = (songFile: Song | null, filename: string | null) => {
    if (!songFile) return;
    setSong(songFile);
    const { name, description, originalAuthor } = songFile.meta;
    const title = name || filename?.replace('.nbs', '') || '';
    formMethods.setValue('title', title);
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
