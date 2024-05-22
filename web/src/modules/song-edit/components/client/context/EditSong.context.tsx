'use client';
import { Song } from '@encode42/nbs.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, useEffect, useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
  useForm,
} from 'react-hook-form';

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

  const {
    register,
    formState: { errors },
  } = formMethods;

  const submitSong = async () => undefined;

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
    <EditSongContext.Provider
      value={{
        formMethods,
        submitSong,
        register,
        errors,
        song,
        sendError,
        isSubmitting,
      }}
    >
      {children}
    </EditSongContext.Provider>
  );
};
