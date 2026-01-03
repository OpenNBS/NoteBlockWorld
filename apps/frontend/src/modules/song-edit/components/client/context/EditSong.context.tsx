'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useEffect, useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import toaster from 'react-hot-toast';
import { undefined as zodUndefined } from 'zod';

import type { UploadSongDto } from '@nbw/database';
import { parseSongFromBuffer, type SongFileType } from '@nbw/song';
import axiosInstance from '@web/lib/axios';
import { getTokenLocal } from '@web/lib/axios/token.utils';
import {
  EditSongFormInput,
  EditSongFormOutput,
  editSongFormSchema,
} from '@web/modules/song/components/client/SongForm.zod';

export type useEditSongProviderType = {
  formMethods: UseFormReturn<EditSongFormInput>;
  submitSong: () => void;
  register: UseFormRegister<EditSongFormInput>;
  errors: FieldErrors<EditSongFormInput>;
  song: SongFileType | null;
  instrumentSounds: string[];
  setInstrumentSound: (index: number, value: string) => void;
  sendError: string | null;
  isSubmitting: boolean;
  loadSong: (id: string, username: string, song: UploadSongDto) => void;
  setSongId: (id: string) => void;
};

export const EditSongContext = createContext<useEditSongProviderType>(
  {} as useEditSongProviderType,
);

export const EditSongProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const formMethods = useForm<EditSongFormInput>({
    resolver: zodResolver(editSongFormSchema),
    mode: 'onBlur',
  });

  const [song, setSong] = useState<SongFileType | null>(null);
  const [instrumentSounds, setInstrumentSounds] = useState<string[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [originalData, setOriginalData] = useState<UploadSongDto | null>(null);

  const { register } = formMethods;

  const router = useRouter();

  const dataWasNotChanged = useCallback(
    function () {
      if (!originalData) {
        return false;
      }

      const rawValues = formMethods.getValues();
      const parsedValues: EditSongFormOutput =
        editSongFormSchema.parse(rawValues);

      const formValues = {
        allowDownload: parsedValues.allowDownload,
        visibility: parsedValues.visibility,
        title: parsedValues.title,
        originalAuthor: parsedValues.originalAuthor,
        description: parsedValues.description,
        thumbnailData: {
          zoomLevel: parsedValues.thumbnailData.zoomLevel,
          startTick: parsedValues.thumbnailData.startTick,
          startLayer: parsedValues.thumbnailData.startLayer,
          backgroundColor: parsedValues.thumbnailData.backgroundColor,
        },
        artist: parsedValues.author,
        customInstruments: parsedValues.customInstruments,
        license: parsedValues.license,
        category: parsedValues.category,
      };

      const comparisons = [
        formValues.allowDownload === originalData.allowDownload,
        formValues.visibility === originalData.visibility,
        formValues.title === originalData.title,
        formValues.originalAuthor === originalData.originalAuthor,
        formValues.description === originalData.description,
        formValues.thumbnailData.zoomLevel ===
          originalData.thumbnailData.zoomLevel,
        formValues.thumbnailData.startTick ===
          originalData.thumbnailData.startTick,
        formValues.thumbnailData.startLayer ===
          originalData.thumbnailData.startLayer,
        formValues.thumbnailData.backgroundColor ===
          originalData.thumbnailData.backgroundColor,
        formValues.customInstruments.length ===
          originalData.customInstruments.length &&
          formValues.customInstruments.every(
            (instrument, index) =>
              instrument === originalData.customInstruments[index],
          ),
        formValues.license === originalData.license,
        formValues.category === originalData.category,
      ];

      console.log(
        comparisons.every((value) => value),
        comparisons,
      );

      console.log(formValues.customInstruments, originalData.customInstruments);

      return comparisons.every((value) => value);
    },
    [formMethods, originalData],
  );

  const submitSong = async (): Promise<void> => {
    const rawValues = formMethods.getValues();
    const parsedValues: EditSongFormOutput =
      editSongFormSchema.parse(rawValues);

    // Build form data
    const formValues: UploadSongDto = {
      allowDownload: parsedValues.allowDownload,
      visibility: parsedValues.visibility as UploadSongDto['visibility'],
      title: parsedValues.title,
      originalAuthor: parsedValues.originalAuthor,
      description: parsedValues.description,
      thumbnailData: {
        zoomLevel: parsedValues.thumbnailData.zoomLevel,
        startTick: parsedValues.thumbnailData.startTick,
        startLayer: parsedValues.thumbnailData.startLayer,
        backgroundColor: parsedValues.thumbnailData.backgroundColor,
      },
      customInstruments: parsedValues.customInstruments,
      license: parsedValues.license as UploadSongDto['license'],
      category: parsedValues.category as UploadSongDto['category'],
      file: zodUndefined,
    };

    // TODO: this comparison is not needed. Use isDirty field from react-hook-form
    if (dataWasNotChanged()) {
      toaster.success('No changes were made to the song!');
      router.push('/my-songs');
      return;
    }

    setIsSubmitting(true);
    setSendError(null);
    const songId = formMethods.getValues().id;

    // Send request
    // Get authorization token from local storage
    const token = getTokenLocal();

    try {
      // Send request
      await axiosInstance.patch(`/song/${songId}/edit`, formValues, {
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
        console.log(error);
        setSendError('An unknown error occurred while submitting the song!');
      }

      setIsSubmitting(false);
      return;
    }

    toaster.success('Song saved successfully!');
    router.push('/my-songs');
  };

  const loadSong = useCallback(
    async (id: string, username: string, songData: UploadSongDto) => {
      setOriginalData(songData);

      formMethods.setValue('allowDownload', true, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: true,
      });

      formMethods.setValue('author', username, {
        shouldDirty: true,
        shouldValidate: false,
        shouldTouch: true,
      });

      formMethods.setValue('visibility', songData.visibility);
      formMethods.setValue('title', songData.title);
      formMethods.setValue('originalAuthor', songData.originalAuthor);
      formMethods.setValue('description', songData.description);

      formMethods.setValue(
        'thumbnailData.zoomLevel',
        songData.thumbnailData.zoomLevel,
      );

      formMethods.setValue(
        'thumbnailData.startTick',
        songData.thumbnailData.startTick,
      );

      formMethods.setValue(
        'thumbnailData.startLayer',
        songData.thumbnailData.startLayer,
      );

      formMethods.setValue(
        'thumbnailData.backgroundColor',
        songData.thumbnailData.backgroundColor,
      );

      formMethods.setValue('license', songData.license);
      formMethods.setValue('category', songData.category);

      // fetch song
      const token = getTokenLocal();

      try {
        // Backend now proxies the file directly, avoiding CORS issues
        const response = await axiosInstance.get(`/song/${id}/download`, {
          params: {
            src: 'edit',
          },
          headers: { authorization: `Bearer ${token}` },
          responseType: 'arraybuffer', // Get as ArrayBuffer for parsing
        });

        const songFile = response.data;

        // convert to song
        const song = await parseSongFromBuffer(songFile);

        // set instruments array
        const songInstruments = songData.customInstruments;
        setInstrumentSounds(songInstruments);
        formMethods.setValue('customInstruments', songInstruments);

        setSong(song);
      } catch (error: unknown) {
        let errorMessage = 'An unknown error occurred while loading the song!';
        if (error instanceof AxiosError) {
          if (error.response) {
            // Server responded with an error status
            errorMessage =
              error.response.data?.message ||
              (error.response.data?.error
                ? Object.values(error.response.data.error)[0]
                : null) ||
              `Failed to load song: ${error.response.status}`;
          } else if (error.request) {
            // Request was made but no response received (network error)
            errorMessage =
              'Network error: Unable to connect to the server. Please check your internet connection and try again.';
          } else {
            // Something else happened (including fetch errors)
            errorMessage = error.message || errorMessage;
          }

          setSendError(errorMessage);
          toaster.error(errorMessage);
          throw error; // Re-throw to allow caller to handle if needed
        } else {
          setSendError(errorMessage);
          toaster.error(errorMessage);
          throw error;
        }
      }
    },
    [formMethods, setSong],
  );

  const setInstrumentSound = useCallback(
    (index: number, value: string) => {
      const newValues = [...instrumentSounds];
      newValues[index] = value;
      setInstrumentSounds(newValues);
      formMethods.setValue('customInstruments', newValues);
    },
    [formMethods, instrumentSounds],
  );

  const setSongId = useCallback(
    (id: string) => formMethods.setValue('id', id),
    [formMethods],
  );

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dataWasNotChanged()) {
        e.preventDefault();

        e.returnValue =
          'Are you sure you want to leave? You have unsaved changes.';
      }
    };

    window.addEventListener('beforeunload', handler);

    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [dataWasNotChanged]);

  return (
    <EditSongContext.Provider
      value={{
        formMethods,
        submitSong,
        instrumentSounds,
        setInstrumentSound,
        register,
        errors: formMethods.formState.errors,
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
