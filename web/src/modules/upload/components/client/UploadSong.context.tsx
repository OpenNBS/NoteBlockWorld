'use client';

import { Song, fromArrayBuffer } from '@encode42/nbs.js';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '@web/src/lib/axios';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  useForm,
} from 'react-hook-form';

import { getTokenLocal } from '../../../../lib/axios/token.utils';
import { UploadSongForm } from '../../types';
import { uploadSongFormSchema } from './uploadSongFrom.zod';

type UploadSongContextType = {
  song: Song | null;
  filename: string | null;
  setFile: (file: File | null) => void;
  invalidFile: boolean;
  formMethods: UseFormReturn<UploadSongForm>;
  submitSong: () => void;
  register: UseFormRegister<UploadSongForm>;
  errors: FieldErrors<UploadSongForm>;
};

const UploadSongContext = createContext<UploadSongContextType>(
  null as unknown as UploadSongContextType
);

export const UploadSongProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = {
    push: (x: string) => {},
  };
  const [song, setSong] = useState<Song | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [invalidFile, setInvalidFile] = useState(false);
  const formMethods = useForm<UploadSongForm>({
    resolver: zodResolver(uploadSongFormSchema),
  });
  const {
    register,
    formState: { errors },
  } = formMethods;

  const submitSongData = async (): Promise<void> => {
    if (!song) throw new Error('Song file not found');
    const fileData = new FormData();
    const arrayBuffer = song?.toArrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      return;
    }
    const blob = new Blob([arrayBuffer]);

    fileData.append('file', blob, 'song.nbs');

    const formValues = formMethods.getValues();
    const param: Record<string, string> = {};

    Object.entries(formValues).forEach(([key, value]) => {
      param[key] = value.toString();
    });
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
      const data = response.data;
      const id = data._id;
      if (typeof id !== 'string') {
        return;
      }
      router.push(`/my-songs?selectedSong=${id}`);
    } else {
      const erro_body = (await response.data) as {
        error: Record<string, string>;
      };
      return;
    }
  };

  const submitSong = async () => {
    try {
      await submitSongData();
    } catch (e) {
      console.log(e);
    }
  };

  const setFileHandler = async (file: File | null) => {
    if (!file) return;
    const song = fromArrayBuffer(await file.arrayBuffer());
    if (song.length <= 0) {
      setInvalidFile(true);
      setSong(null);
      return;
    }
    setSong(song);
    setFilename(file.name);

    const { name, description, originalAuthor } = song.meta;
    const title = name || filename?.replace('.nbs', '') || '';
    formMethods.setValue('title', title);
    formMethods.setValue('description', description);
    formMethods.setValue('originalAuthor', originalAuthor);
  };
  useEffect(() => {
    if (song) {
      formMethods.setValue('coverData.zoomLevel', 1);
      formMethods.setValue('coverData.startTick', 0);
      formMethods.setValue('coverData.startLayer', 0);
      formMethods.setValue('coverData.backgroundColor', '#ffffff');
      formMethods.setValue('customInstruments', ['noteblock']);
    }
  }, [song]);

  return (
    <UploadSongContext.Provider
      value={{
        formMethods,
        register,
        errors,
        submitSong,
        song,
        invalidFile,
        filename,
        setFile: setFileHandler,
      }}
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
