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

import axios from '@web/src/lib/axios';
import axiosInstance from '@web/src/lib/axios';
import { getTokenLocal } from '@web/src/lib/axios/token.utils';

import {
  EditSongForm,
  editSongFormSchema,
} from '../../../../upload/components/client/uploadSongForm.zod';

export type useEditSongProviderType = {
  formMethods: UseFormReturn<EditSongForm>;
  submitSong: () => void;
  register: UseFormRegister<EditSongForm>;
  errors: FieldErrors<EditSongForm>;
  song: Song | null;
  sendError: string | null;
  isSubmitting: boolean;
  loadSong: (id: string, username: string, song: UploadSongDtoType) => void;
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
    // Build form data
    const formData = new FormData();
    const formValues = formMethods.getValues();
    Object.entries(formValues)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const songId = formValues.id as string;
    // Get authorization token from local storage
    const token = getTokenLocal();
    try {
      // Send request
      const response = await axiosInstance.patch(
        `/song/${songId}/edit
      }`,
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const data = response.data;
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
        await axios.get(`/song/${id}/download?src=edit`, {
          responseType: 'arraybuffer',
        })
      ).data as ArrayBuffer;
      // convert to song
      const song = fromArrayBuffer(songFile);
      setSong(song);
    },
    [formMethods, setSong],
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
      }}
    >
      {children}
    </EditSongContext.Provider>
  );
};
