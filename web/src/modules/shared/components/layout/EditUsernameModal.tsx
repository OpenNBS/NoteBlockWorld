'use client';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { LoggedUserData } from '@web/src/modules/auth/types/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosInstance from '@web/src/lib/axios';
import { AxiosError } from 'axios';
import { useState } from 'react';
import GenericModal from '../client/GenericModal';
import { toast } from 'react-hot-toast';

type EditUsernameModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  userData: LoggedUserData;
};

export const EditUsernameModal = ({
  isOpen,
  setIsOpen,
  userData,
}: EditUsernameModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const result = await axiosInstance.patch('/user/username', {
        username: userData.username,
      });

      console.log(result);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenericModal title='Edit username' isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className='flex flex-col gap-4'>
        <div>
          <label htmlFor='username' className='block text-white'>
            Username
          </label>
          <input
            type='text'
            id='username'
            name='username'
            className='w-full bg-zinc-700 text-white rounded-lg p-2'
            defaultValue={userData.username}
            disabled={isLoading}
          />
        </div>
        <div className='flex justify-end'>
          <button
            onClick={onClick}
            className='text-sm px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-400'
            disabled={isLoading}
          >
            Edit username
            <FontAwesomeIcon className='ml-2' icon={faPen} />
          </button>
        </div>
      </div>
    </GenericModal>
  );
};
