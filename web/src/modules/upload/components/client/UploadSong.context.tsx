'use client';

import { Song, fromArrayBuffer } from '@encode42/nbs.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  useForm,
} from 'react-hook-form';

import axiosInstance from '@web/src/lib/axios';
import { getTokenLocal } from '@web/src/lib/axios/token.utils';

import { uploadSongFormSchema } from './uploadSongForm.zod';
import { UploadSongForm } from '../../types';

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
  null as unknown as UploadSongContextType,
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
    Object.entries(formValues)
      .filter(([key, _]) => key !== 'coverData' && key !== 'customInstruments')
      .forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    formData.append('coverData', JSON.stringify(formValues.coverData));
    formData.append(
      'customInstruments',
      JSON.stringify(formValues.customInstruments),
    );

    // Get authorization token from local storage
    const token = getTokenLocal();

    // Send request
    await axiosInstance
      .post(`/song`, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const data = response.data;
        const id = data._id as string;
        //router.push(`/my-songs?selectedSong=${id}`);
      })
      .catch((error) => {
        console.error('Error submitting song', error);
        if (error.response) {
          setSendError(error.response.data.error.file);
        } else {
          setSendError('An unknown error occurred while submitting the song!');
        }
        return;
      });
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
      formMethods.setValue('customInstruments', [
        'custom1',
        'custom2',
        'custom3',
      ]);
    }
  }, [song, formMethods]);

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
      'useUploadSongProvider must be used within a UploadSongProvider',
    );
  }
  return context;
};
