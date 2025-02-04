'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { parseSongFromBuffer } from '@shared/features/song/parse';
import { SongFileType } from '@shared/features/song/types';
import { UploadSongDtoType } from '@shared/validation/song/dto/types';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useEffect, useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import toaster from 'react-hot-toast';
import { undefined } from 'zod';

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
  song: SongFileType | null;
  instrumentSounds: string[];
  setInstrumentSound: (index: number, value: string) => void;
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

  const [song, setSong] = useState<SongFileType | null>(null);
  const [instrumentSounds, setInstrumentSounds] = useState<string[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [originalData, setOriginalData] = useState<UploadSongDtoType | null>(
    null,
  );

  const {
    register,
    formState: { errors },
  } = formMethods;

  const router = useRouter();

  const dataWasNotChanged = useCallback(
    function () {
      if (!originalData) {
        return false;
      }

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
          backgroundColor:
            formMethods.getValues().thumbnailData.backgroundColor,
        },
        artist: formMethods.getValues().author,
        customInstruments: formMethods.getValues().customInstruments,
        license: formMethods.getValues().license,
        category: formMethods.getValues().category,
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
    // Build form data
    const formValues: UploadSongDtoType = {
      allowDownload: formMethods.getValues().allowDownload,
      visibility: formMethods.getValues()
        .visibility as UploadSongDtoType['visibility'],
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
      license: formMethods.getValues().license as UploadSongDtoType['license'],
      category: formMethods.getValues()
        .category as UploadSongDtoType['category'],
      file: undefined,
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
    async (id: string, username: string, songData: UploadSongDtoType) => {
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

      const songFile = (
        await axiosInstance.get(`/song/${id}/download`, {
          params: {
            src: 'edit',
          },
          responseType: 'arraybuffer',
          headers: { authorization: `Bearer ${token}` },
        })
      ).data as ArrayBuffer;

      // convert to song
      const song = await parseSongFromBuffer(songFile);

      // set instruments array
      const songInstruments = songData.customInstruments;
      setInstrumentSounds(songInstruments);
      formMethods.setValue('customInstruments', songInstruments);

      setSong(song);
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
