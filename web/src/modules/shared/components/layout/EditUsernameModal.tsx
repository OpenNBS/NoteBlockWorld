'use client';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ClientAxios from '@web/src/lib/axios/ClientAxios';
import { LoggedUserData } from '@web/src/modules/auth/types/User';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import GenericModal from '../client/GenericModal';
import { SubmitHandler, useForm } from 'react-hook-form';

interface EditUsernameModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  userData: LoggedUserData;
}

interface FormValues {
  username: string;
}

export const EditUsernameModal = ({
  isOpen,
  setIsOpen,
  userData,
}: EditUsernameModalProps) => {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await ClientAxios.patch('/user/username', {
        username: data.username,
      });

      toast.success('Username updated successfully');

      // refresh the page
      window.location.reload();
    } catch (error: unknown) {
      if ((error as any).isAxiosError) {
        const axiosError = error as AxiosError;

        // verify for throttling limit error
        if (axiosError.response?.status === 429) {
          toast.error('Too many requests. Please try again later.');
        }

        // verify for validation error
        if (axiosError.response?.status === 400) {
          toast.error('Invalid username');
        }

        // verify for unauthorized error
        if (axiosError.response?.status === 401) {
          toast.error('Unauthorized');
        }

        return;
      }

      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <GenericModal title='Edit username' isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className='flex flex-col gap-4'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <span className='text-red-500 text-sm font-medium h-4'>
            {errors.username && errors.username.message}
          </span>
          <label htmlFor='username' className='block text-white'>
            Username
          </label>
          <input
            autoFocus
            type='text'
            id='username'
            {...register('username', { required: 'Username is required' })}
            className='w-full bg-zinc-700 text-white rounded-lg p-2'
            defaultValue={userData.username}
            disabled={isSubmitting}
          />
          <div className='flex justify-end'>
            <button
              type='submit'
              className='text-sm px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-400'
              disabled={isSubmitting}
            >
              Edit username
              <FontAwesomeIcon className='ml-2' icon={faPen} />
            </button>
          </div>
        </form>
      </div>
    </GenericModal>
  );
};
