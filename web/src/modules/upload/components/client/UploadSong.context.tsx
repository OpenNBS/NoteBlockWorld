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
import { z as zod } from 'zod';
import { getTokenLocal } from '../../../../lib/axios/token.utils';

type CoverData = {
  zoomLevel: number;
  startTick: number;
  startLayer: number;
  backgroundColor: string;
};

type UploadSongForm = {
  allowDownload: boolean;
  visibility: 'public' | 'private'; // Use a string literal type if the visibility can only be 'public' or 'private'
  title: string;
  originalAuthor: string;
  description: string;
  coverData: CoverData;
  customInstruments: string[];
  license: 'no_license' | 'cc_by_4' | 'public_domain';
  tags: string;
  category:
    | 'Gaming'
    | 'MoviesNTV'
    | 'Anime'
    | 'Vocaloid'
    | 'Rock'
    | 'Pop'
    | 'Electronic'
    | 'Ambient'
    | 'Jazz'
    | 'Classical';
};

const coverDataSchema = zod.object({
  zoomLevel: zod.number().int().min(1).max(5),
  startTick: zod.number().int().min(0),
  startLayer: zod.number().int().min(0),
  backgroundColor: zod.string().regex(/^#[0-9a-fA-F]{6}$/),
});

const uploadSongFormSchema = zod.object({
  allowDownload: zod.boolean(),
  visibility: zod.union([zod.literal('public'), zod.literal('private')]),
  title: zod
    .string()
    .max(64, {
      message: 'Title must be less than 64 characters',
    })
    .min(1, {
      message: 'Title must be at least 1 character',
    }),
  originalAuthor: zod
    .string()
    .max(64, {
      message: 'Original author must be less than 64 characters',
    })
    .min(0),
  description: zod.string().max(1024, {
    message: 'Description must be less than 1024 characters',
  }),
  coverData: coverDataSchema,
  customInstruments: zod.array(zod.string()),
  license: zod.union([
    zod.literal('no_license'),
    zod.literal('cc_by_4'),
    zod.literal('public_domain'),
  ]),
  category: zod.union([
    zod.literal('Gaming'),
    zod.literal('MoviesNTV'),
    zod.literal('Anime'),
    zod.literal('Vocaloid'),
    zod.literal('Rock'),
    zod.literal('Pop'),
    zod.literal('Electronic'),
    zod.literal('Ambient'),
    zod.literal('Jazz'),
    zod.literal('Classical'),
  ]),
});

type UploadSongContextType = {
  song: Song | null;
  filename: string | null;
  setFile: (file: File | null) => void;
  invalidFile: boolean;
  formMethods: UseFormReturn<UploadSongForm>;
  submitSong: () => void;
  register: UseFormRegister<UploadSongForm>;
  errors: FieldErrors<UploadSongForm>;
};

const UploadSongContext = createContext<UploadSongContextType>(
  null as unknown as UploadSongContextType
);

export const UploadSongProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = {
    push: (x: string) => {},
  };
  const [song, setSong] = useState<Song | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [invalidFile, setInvalidFile] = useState(false);
  const formMethods = useForm<UploadSongForm>({
    resolver: zodResolver(uploadSongFormSchema),
  });
  const {
    register,
    formState: { errors },
  } = formMethods;

  const submitSongData = async (): Promise<void> => {
    if (!song) throw new Error('Song file not found');
    const fileData = new FormData();
    const arrayBuffer = song?.toArrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      return;
    }
    const blob = new Blob([arrayBuffer]);

    fileData.append('file', blob, 'song.nbs');

    const formValues = formMethods.getValues();
    const param = {
      allowDownload: formValues.allowDownload.toString(),
      visibility: formValues.visibility.toString(),
      title: formValues.title,
      originalAuthor: formValues.originalAuthor,
      description: formValues.description,
      zoomLevel: formValues.coverData.zoomLevel.toString(),
      startTick: formValues.coverData.startTick.toString(),
      startLayer: formValues.coverData.startLayer.toString(),
      backgroundColor: formValues.coverData.backgroundColor.toString(),
      customInstruments: formValues.customInstruments.toString(),
    } as Record<string, string>;
    const query = new URLSearchParams(param);
    const token = getTokenLocal();
    const response = await axiosInstance.post(
      `/song?${query.toString()}`,
      fileData,
      {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.status === 201) {
      const data = response.data;
      console.log(data);
      const id = data._id;
      if (typeof id !== 'string') {
        return;
      }
      router.push(`/my-songs?selectedSong=${id}`);
    } else {
      const erro_body = (await response.data) as {
        error: Record<string, string>;
      };
      return;
    }
  };

  const submitSong = async () => {
    try {
      await submitSongData();
    } catch (e) {
      console.log(e);
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
    }
  }, [song]);

  return (
    <UploadSongContext.Provider
      value={{
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
