'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { parseSongFromBuffer } from '@shared/features/song/parse';
import { SongFileType } from '@shared/features/song/types';
import { bgColors } from '@shared/features/thumbnail/colors';
import { ThumbnailConst } from '@shared/validation/song/constants';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import { toast } from 'react-hot-toast';

import axiosInstance from '@web/src/lib/axios';
import {
  InvalidTokenError,
  getTokenLocal,
} from '@web/src/lib/axios/token.utils';

import {
  UploadSongForm,
  uploadSongFormSchema,
} from '../../../../song/components/client/SongForm.zod';
import UploadCompleteModal from '../UploadCompleteModal';

export type useUploadSongProviderType = {
  song: SongFileType | null;
  filename: string | null;
  setFile: (file: File | null) => void;
  instrumentSounds: string[];
  setInstrumentSound: (index: number, value: string) => void;
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
  const [song, setSong] = useState<SongFileType | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [instrumentSounds, setInstrumentSounds] = useState<string[]>([]);
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

  async function submitSongData(): Promise<void> {
    // Get song file from state
    setSendError(null);

    if (!song) {
      setSendError('Song file not found');
      throw new Error('Song file not found');
    }

    const arrayBuffer = song.arrayBuffer;

    if (arrayBuffer.byteLength === 0) {
      setSendError('Song file is invalid');
      throw new Error('Song file is invalid');
    }

    const blob = new Blob([arrayBuffer]);

    // Build form data
    const formData = new FormData();
    formData.append('file', blob, filename || 'song.nbs');
    const formValues = formMethods.getValues();

    Object.entries(formValues)
      .filter(
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
      if (error.response) {
        console.log('Error response', error.response);

        setSendError(
          error.response.data.message ||
            Object.values(error.response.data.error)[0],
        );
      } else {
        setSendError(
          'An unknown error occurred while uploading the song! Please contact us.',
        );
      }
    }
  }

  const submitSong = async () => {
    try {
      setIsSubmitting(true);
      await submitSongData();
      setIsUploadComplete(true);
    } catch (e) {
      console.error('Error submitting song', e);

      if (e instanceof InvalidTokenError) {
        setSendError(
          'Your session has expired! Please sign in again and try to submit the song.',
        );
      } else {
        setSendError(
          'An unknown error occurred while submitting the song! Please contact us.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const setFileHandler = async (file: File | null) => {
    if (!file) return;

    let song: SongFileType;

    try {
      song = await parseSongFromBuffer(await file.arrayBuffer());
    } catch (e) {
      console.error('Error parsing song file', e);
      toast.error('Invalid song file! Please try again with a different song.');
      setSong(null);

      return;
    }

    setSong(song);
    setFilename(file.name);

    const { title, description, originalAuthor } = song;
    const formTitle = title || file.name.replace('.nbs', '');
    formMethods.setValue('title', formTitle);
    formMethods.setValue('description', description);
    formMethods.setValue('originalAuthor', originalAuthor);

    const instrumentList = song.instruments.map(
      (instrument) => instrument.file,
    );

    formMethods.setValue('customInstruments', instrumentList);
    setInstrumentSounds(instrumentList);
  };

  const setInstrumentSound = (index: number, value: string) => {
    const newValues = [...instrumentSounds];
    newValues[index] = value;
    setInstrumentSounds(newValues);
    formMethods.setValue('customInstruments', newValues);
  };

  useEffect(() => {
    if (song) {
      formMethods.setValue(
        'thumbnailData.zoomLevel',
        ThumbnailConst.zoomLevel.default,
      );

      formMethods.setValue(
        'thumbnailData.startTick',
        ThumbnailConst.startTick.default,
      );

      formMethods.setValue(
        'thumbnailData.startLayer',
        ThumbnailConst.startLayer.default,
      );

      const colorKeys = Object.keys(bgColors);
      const randomColor = (colorKeys.length * Math.random()) << 0;

      formMethods.setValue(
        'thumbnailData.backgroundColor',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        bgColors[colorKeys[randomColor]].dark,
      );

      formMethods.setValue('allowDownload', true);

      // disable allowDownload
    }
  }, [song, formMethods]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (formMethods.formState.isDirty && !isUploadComplete) {
        e.preventDefault();

        e.returnValue =
          'Are you sure you want to leave? You have unsaved changes.';
      }
    };

    window.addEventListener('beforeunload', handler);

    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [formMethods.formState.isDirty, isUploadComplete]);

  return (
    <UploadSongContext.Provider
      value={{
        sendError,
        formMethods,
        register,
        errors,
        submitSong,
        song,
        filename,
        instrumentSounds,
        setInstrumentSound,
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
