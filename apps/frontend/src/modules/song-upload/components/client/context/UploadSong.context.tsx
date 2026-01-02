'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, useContext, useEffect } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

import { BG_COLORS, THUMBNAIL_CONSTANTS, UPLOAD_CONSTANTS } from '@nbw/config';
import { parseSongFromBuffer, type SongFileType } from '@nbw/song';
import axiosInstance from '@web/lib/axios';
import { InvalidTokenError, getTokenLocal } from '@web/lib/axios/token.utils';
import {
  UploadSongForm,
  uploadSongFormSchema,
} from '@web/modules/song/components/client/SongForm.zod';

import UploadCompleteModal from '../UploadCompleteModal';

interface UploadSongState {
  song: SongFileType | null;
  filename: string | null;
  instrumentSounds: string[];
  isSubmitting: boolean;
  sendError: string | null;
  isUploadComplete: boolean;
  uploadedSongId: string | null;
}

interface UploadSongActions {
  setSong: (song: SongFileType | null) => void;
  setFilename: (filename: string | null) => void;
  setInstrumentSounds: (sounds: string[]) => void;
  setInstrumentSound: (index: number, value: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setSendError: (error: string | null) => void;
  setIsUploadComplete: (isComplete: boolean) => void;
  setUploadedSongId: (id: string | null) => void;
  reset: () => void;
}

type UploadSongStore = UploadSongState & UploadSongActions;

const initialState: UploadSongState = {
  song: null,
  filename: null,
  instrumentSounds: [],
  isSubmitting: false,
  sendError: null,
  isUploadComplete: false,
  uploadedSongId: null,
};

export const useUploadSongStore = create<UploadSongStore>((set, get) => ({
  ...initialState,

  setSong: (song) => set({ song }),
  setFilename: (filename) => set({ filename }),
  setInstrumentSounds: (sounds) => set({ instrumentSounds: sounds }),
  setInstrumentSound: (index, value) => {
    const newValues = [...get().instrumentSounds];
    newValues[index] = value;
    set({ instrumentSounds: newValues });
  },
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSendError: (error) => set({ sendError: error }),
  setIsUploadComplete: (isComplete) => set({ isUploadComplete: isComplete }),
  setUploadedSongId: (id) => set({ uploadedSongId: id }),
  reset: () => set(initialState),
}));

// Context for form methods (React Hook Form needs to be initialized in a component)
interface UploadSongFormContextType {
  formMethods: UseFormReturn<UploadSongForm>;
  register: UseFormRegister<UploadSongForm>;
  errors: FieldErrors<UploadSongForm>;
  setFile: (file: File | null) => Promise<void>;
  setInstrumentSound: (index: number, value: string) => void;
  submitSong: () => Promise<void>;
}

const UploadSongFormContext = createContext<UploadSongFormContextType | null>(
  null,
);

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

export const UploadSongProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = useUploadSongStore();
  const {
    song,
    filename,
    instrumentSounds,
    isSubmitting,
    sendError,
    isUploadComplete,
    uploadedSongId,
    setSong,
    setFilename,
    setInstrumentSounds,
    setInstrumentSound: setInstrumentSoundStore,
    setIsSubmitting,
    setSendError,
    setIsUploadComplete,
    setUploadedSongId,
  } = store;

  const formMethods = useForm<UploadSongForm>({
    resolver: zodResolver(uploadSongFormSchema),
    mode: 'onBlur',
    // Prevents values from appearing empty on first render
    defaultValues: {
      category: UPLOAD_CONSTANTS.category.default,
      license: UPLOAD_CONSTANTS.license.default,
      visibility: 'public',
      allowDownload: true,
      customInstruments: [],
    },
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

    let parsedSong: SongFileType;

    try {
      parsedSong = await parseSongFromBuffer(await file.arrayBuffer());
    } catch (e) {
      console.error('Error parsing song file', e);
      toast.error('Invalid song file! Please try again with a different song.');
      setSong(null);
      return;
    }

    setSong(parsedSong);
    setFilename(file.name);

    const { title, description, originalAuthor } = parsedSong;
    const formTitle = title || file.name.replace('.nbs', '');
    formMethods.setValue('title', formTitle);
    formMethods.setValue('description', description);
    formMethods.setValue('originalAuthor', originalAuthor);

    const instrumentList = parsedSong.instruments.map(
      (instrument) => instrument.file,
    );

    formMethods.setValue('customInstruments', instrumentList);
    setInstrumentSounds(instrumentList);
  };

  const setInstrumentSound = (index: number, value: string) => {
    setInstrumentSoundStore(index, value);
    const newValues = [...instrumentSounds];
    newValues[index] = value;
    formMethods.setValue('customInstruments', newValues);
  };

  useEffect(() => {
    if (song) {
      formMethods.setValue(
        'thumbnailData.zoomLevel',
        THUMBNAIL_CONSTANTS.zoomLevel.default,
      );

      formMethods.setValue(
        'thumbnailData.startTick',
        THUMBNAIL_CONSTANTS.startTick.default,
      );

      formMethods.setValue(
        'thumbnailData.startLayer',
        THUMBNAIL_CONSTANTS.startLayer.default,
      );

      const colorKeys = Object.keys(BG_COLORS);
      const randomColor = (colorKeys.length * Math.random()) << 0;

      formMethods.setValue(
        'thumbnailData.backgroundColor',

        // @ts-ignore
        BG_COLORS[colorKeys[randomColor]].dark,
      );

      formMethods.setValue('allowDownload', true);
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

  const formContextValue: UploadSongFormContextType = {
    formMethods,
    register,
    errors,
    setFile: setFileHandler,
    setInstrumentSound,
    submitSong,
  };

  return (
    <UploadSongFormContext.Provider value={formContextValue}>
      {uploadedSongId && (
        <UploadCompleteModal
          isOpen={isUploadComplete}
          songId={uploadedSongId}
        />
      )}
      {children}
    </UploadSongFormContext.Provider>
  );
};

export const useUploadSongProvider = (): useUploadSongProviderType => {
  const store = useUploadSongStore();
  const formContext = useContext(UploadSongFormContext);

  if (!formContext) {
    throw new Error(
      'useUploadSongProvider must be used within UploadSongProvider',
    );
  }

  return {
    ...store,
    ...formContext,
  };
};
