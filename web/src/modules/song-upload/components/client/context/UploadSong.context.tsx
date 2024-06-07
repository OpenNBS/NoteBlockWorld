'use client';
import { Song, fromArrayBuffer } from '@encode42/nbs.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  useForm,
} from 'react-hook-form';

import axiosInstance from '@web/src/lib/axios';
import { getTokenLocal } from '@web/src/lib/axios/token.utils';

import {
  UploadSongForm,
  uploadSongFormSchema,
} from '../../../../song/components/client/SongForm.zod';
import UploadCompleteModal from '../UploadCompleteModal';

export type useUploadSongProviderType = {
  song: Song | null;
  filename: string | null;
  setFile: (file: File | null) => void;
  invalidFile: boolean;
  formMethods: UseFormReturn<UploadSongForm>;
  submitSong: () => void;
  register: UseFormRegister<UploadSongForm>;
  errors: FieldErrors<UploadSongForm>;
  sendError: string | null;
  isSubmitting: boolean;
  isUploadComplete: boolean;
  uploadedSongId: string | null;
};
export const UploadSongContext = createContext<useUploadSongProviderType>(
  null as unknown as useUploadSongProviderType,
);
export const UploadSongProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [song, setSong] = useState<Song | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [invalidFile, setInvalidFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  {
    /* TODO: React Hook Form has an isSubmitting attribute. Can we leverage it? https://react-hook-form.com/docs/useformstate */
  }
  const [sendError, setSendError] = useState<string | null>(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [uploadedSongId, setUploadedSongId] = useState<string | null>(null);

  const formMethods = useForm<UploadSongForm>({
    resolver: zodResolver(uploadSongFormSchema),
    mode: 'onBlur',
  });
  const {
    register,
    formState: { errors },
  } = formMethods;

  const submitSongData = async (): Promise<void> => {
    // Get song file from state
    setSendError(null);
    if (!song) {
      throw new Error('Song file not found');
    }
    const arrayBuffer = song.toArrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      throw new Error('Song file is invalid');
    }
    const blob = new Blob([arrayBuffer]);

    // Build form data
    const formData = new FormData();
    formData.append('file', blob, filename || 'song.nbs');
    const formValues = formMethods.getValues();
    Object.entries(formValues)
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([key, _]) => key !== 'thumbnailData' && key !== 'customInstruments',
      )
      .forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    formData.append('thumbnailData', JSON.stringify(formValues.thumbnailData));
    formData.append(
      'customInstruments',
      JSON.stringify(formValues.customInstruments),
    );

    // Get authorization token from local storage
    const token = getTokenLocal();
    try {
      // Send request
      const response = await axiosInstance.post(`/song`, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      const id = data.publicId as string;
      setUploadedSongId(id);
      setIsUploadComplete(true);
    } catch (error: any) {
      console.error('Error submitting song', error);
      if (error.response) {
        setSendError(error.response.data.error.file);
      } else {
        setSendError('An unknown error occurred while submitting the song!');
      }
    }
  };

  const submitSong = async () => {
    try {
      setIsSubmitting(true);
      await submitSongData();
      setIsUploadComplete(true);
    } catch (e) {
      console.log(e); // TODO: handle error
      //formMethods.setError('file', { message: 'An error occurred' });
    } finally {
      setIsSubmitting(false);
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
      formMethods.setValue('thumbnailData.zoomLevel', 3);
      formMethods.setValue('thumbnailData.startTick', 0);
      formMethods.setValue('thumbnailData.startLayer', 0);
      formMethods.setValue('thumbnailData.backgroundColor', '#ffffff');
      formMethods.setValue('customInstruments', [
        'custom1',
        'custom2',
        'custom3',
      ]);

      formMethods.setValue('allowDownload', true);

      // disable allowDownload
    }
  }, [song, formMethods]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (song) {
        e.preventDefault();
        e.returnValue =
          'Are you sure you want to leave? You have unsaved changes.';
      }
    };

    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
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
        isSubmitting,
        isUploadComplete,
        uploadedSongId,
      }}
    >
      {uploadedSongId && (
        <UploadCompleteModal
          isOpen={isUploadComplete}
          songId={uploadedSongId}
        />
      )}
      {children}
    </UploadSongContext.Provider>
  );
};

export const useUploadSongProvider = (): useUploadSongProviderType => {
  return useContext(UploadSongContext);
};