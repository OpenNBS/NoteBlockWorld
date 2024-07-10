'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { parseSongFromBuffer } from '@shared/features/song/parse';
import { SongFileType } from '@shared/features/song/types';
import { ThumbnailConst } from '@shared/validation/song/constants';
import { UploadSongDtoType } from '@shared/validation/song/dto/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useEffect, useState } from 'react';
import {
  FieldErrors,
  FormProvider,
  UseFormRegister,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import toaster from 'react-hot-toast';

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
  song: SongFileType | null;
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
  const [song, setSong] = useState<SongFileType | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const formMethods = useForm<EditSongForm>({
    resolver: zodResolver(editSongFormSchema),
    mode: 'onBlur',
    defaultValues: {
      thumbnailData: {
        zoomLevel: ThumbnailConst.zoomLevel.default,
        startTick: ThumbnailConst.startTick.default,
        startLayer: ThumbnailConst.startLayer.default,
        backgroundColor: ThumbnailConst.backgroundColor.default,
      },
    },
  });

  const {
    register,
    formState: { errors },
    reset,
    getValues,
  } = formMethods;

  const submitSong = async (): Promise<void> => {
    const formValues: UploadSongDtoType = { ...getValues(), file: null };

    setIsSubmitting(true);
    setSendError(null);
    const songId = getValues().id;
    const token = getTokenLocal();

    try {
      await axios.patch(`/song/${songId}/edit`, formValues, {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      console.error('Error submitting song', error);

      if (error.response) {
        setSendError(
          error.response.data.message ||
            Object.values(error.response.data.error)[0],
        );
      } else {
        setSendError('An unknown error occurred while submitting the song!');
      }

      setIsSubmitting(false);
      return;
    }

    toaster.success('Song saved successfully!');
    router.push('/my-songs');
  };

  const loadSong = useCallback(
    async (id: string, username: string, songData: UploadSongDtoType) => {
      const songFile = (
        await axios.get(`/song/${id}/download`, {
          params: { src: 'edit' },
          responseType: 'arraybuffer',
        })
      ).data as ArrayBuffer;

      const song = parseSongFromBuffer(songFile);

      // pad instruments array for safety
      const songInstruments = Array(song.instruments.length).fill('');

      songData.customInstruments.forEach((instrument, index) => {
        songInstruments[index] = instrument;
      });

      formMethods.setValue('customInstruments', songInstruments);

      setSong(song);

      reset({
        ...songData,
        allowDownload: true,
        author: username,
      });
    },
    [reset],
  );

  const setSongId = useCallback(
    (id: string) => reset({ ...getValues(), id }),
    [getValues, reset],
  );

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (formMethods.formState.isDirty) {
        e.preventDefault();

        e.returnValue =
          'Are you sure you want to leave? You have unsaved changes.';
      }
    };

    window.addEventListener('beforeunload', handler);

    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [formMethods.formState.isDirty]);

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
      <FormProvider {...formMethods}>{children}</FormProvider>
    </EditSongContext.Provider>
  );
};
