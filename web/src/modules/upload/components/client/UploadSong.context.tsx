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
import { useRouter } from 'next/navigation';

type UploadSongContextType = {
  song: Song | null;
  filename: string | null;
  setFile: (file: File | null) => void;
  invalidFile: boolean;
  formMethods: UseFormReturn<UploadSongForm>;
  submitSong: () => void;
  register: UseFormRegister<UploadSongForm>;
  errors: FieldErrors<UploadSongForm>;
  sendError: string | null;
};

const UploadSongContext = createContext<UploadSongContextType>(
  null as unknown as UploadSongContextType
);

export const UploadSongProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [song, setSong] = useState<Song | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [invalidFile, setInvalidFile] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const formMethods = useForm<UploadSongForm>({
    resolver: zodResolver(uploadSongFormSchema),
  });
  const {
    register,
    formState: { errors },
  } = formMethods;

  const submitSongData = async (): Promise<void> => {
    // Get song file from state
    if (!song) {
      throw new Error('Song file not found');
    }
    const arrayBuffer = song?.toArrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      throw new Error('Song file is invalid');
    }
    const blob = new Blob([arrayBuffer]);

    // Build form data
    const formData = new FormData();
    formData.append('file', blob, 'song.nbs');
    const formValues = formMethods.getValues();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    // Get authorization token from local storage
    const token = getTokenLocal();

    // Send request
    const response = await axiosInstance.post(`/song`, formData, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Handle response
    if (response.status === 201) {
      const data = response.data;
      const id = data._id as string;
      router.push(`/my-songs?selectedSong=${id}`);
    } else {
      const error_body = (await response.data) as {
        message: string;
      };
      setSendError(error_body.message);
      return;
    }
  };

  const submitSong = async () => {
    try {
      await submitSongData();
    } catch (e) {
      console.log(e); // TODO: handle error
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
        sendError,
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
