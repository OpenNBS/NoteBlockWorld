'use client';

import { Song, fromArrayBuffer } from '@encode42/nbs.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadSongDtoType } from '@nbw/validation/song/dto/types';
import { createContext, useCallback, useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  useForm,
} from 'react-hook-form';

import axiosInstance from '@web/src/lib/axios';
import { getTokenLocal } from '@web/src/lib/axios/token.utils';

import {
  EditSongForm,
  editSongFormSchema,
} from '../../../../song/components/client/SongForm.zod';

export type useEditSongProviderType = {
  formMethods: UseFormReturn<EditSongForm>;
  submitSong: () => void;
  register: UseFormRegister<EditSongForm>;
  errors: FieldErrors<EditSongForm>;
  song: Song | null;
  sendError: string | null;
  isSubmitting: boolean;
  loadSong: (id: string, username: string, song: UploadSongDtoType) => void;
  setSongId: (id: string) => void;
};
export const EditSongContext = createContext<useEditSongProviderType>(
  null as unknown as useEditSongProviderType,
);
export const EditSongProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const formMethods = useForm<EditSongForm>({
    resolver: zodResolver(editSongFormSchema),
    mode: 'onBlur',
  });

  const [song, setSong] = useState<Song | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  const {
    register,
    formState: { errors },
  } = formMethods;

  const submitSong = async (): Promise<void> => {
    setSendError(null);
    const songId = formMethods.getValues().id;
    // Build form data
    const formValues = {
      allowDownload: formMethods.getValues().allowDownload,
      visibility: formMethods.getValues().visibility,
      title: formMethods.getValues().title,
      originalAuthor: formMethods.getValues().originalAuthor,
      description: formMethods.getValues().description,
      thumbnailData: {
        zoomLevel: formMethods.getValues().thumbnailData.zoomLevel,
        startTick: formMethods.getValues().thumbnailData.startTick,
        startLayer: formMethods.getValues().thumbnailData.startLayer,
        backgroundColor: formMethods.getValues().thumbnailData.backgroundColor,
      },
      customInstruments: formMethods.getValues().customInstruments,
      license: formMethods.getValues().license,
      category: formMethods.getValues().category,
    };

    // Send request
    // Get authorization token from local storage
    const token = getTokenLocal();
    try {
      // Send request
      const response = await axiosInstance.patch(
        `/song/${songId}/edit`,
        formValues,
        {
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = response.data;
      setIsUploadComplete(true);
    } catch (error: any) {
      console.error('Error submitting song', error);
      if (error.response) {
        setSendError(error.response.data.message);
      } else {
        setSendError('An unknown error occurred while submitting the song!');
      }
    }
  };

  const loadSong = useCallback(
    async (id: string, username: string, songData: UploadSongDtoType) => {
      formMethods.reset({
        allowDownload: songData.allowDownload,
        visibility: songData.visibility,
        title: songData.title,
        originalAuthor: songData.originalAuthor,
        artist: username,
        description: songData.description,
        thumbnailData: {
          zoomLevel: songData.thumbnailData.zoomLevel,
          startTick: songData.thumbnailData.startTick,
          startLayer: songData.thumbnailData.startLayer,
          backgroundColor: songData.thumbnailData.backgroundColor,
        },
        customInstruments: songData.customInstruments,
        license: songData.license,
        category: songData.category,
      });
      // fetch song
      const songFile = (
        await axiosInstance.get(`/song/${id}/download?src=edit`, {
          responseType: 'arraybuffer',
        })
      ).data as ArrayBuffer;
      // convert to song
      const song = fromArrayBuffer(songFile);
      setSong(song);
    },
    [formMethods, setSong],
  );

  const setSongId = useCallback(
    (id: string) => formMethods.setValue('id', id),
    [formMethods],
  );

  return (
    <EditSongContext.Provider
      value={{
        formMethods,
        submitSong,
        register,
        errors,
        song,
        sendError,
        isSubmitting,
        loadSong,
        setSongId,
      }}
    >
      {children}
    </EditSongContext.Provider>
  );
};
