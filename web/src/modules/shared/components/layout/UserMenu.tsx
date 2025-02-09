'use client';

import {
  faCheck,
  faClose,
  faMusic,
  faPencil,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoggedUserData } from '@web/src/modules/auth/types/User';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { UserMenuButton } from '../client/UserMenuButton';
import { UserMenuLink, UserMenuSplitLine } from './UserMenuLink';
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { SubmitHandler, useForm } from 'react-hook-form';
import ClientAxios from '@web/src/lib/axios/ClientAxios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { UserConst } from '@shared/validation/user/constants';

interface FormValues {
  username: string;
}

export const UserMenu = ({ userData }: { userData: LoggedUserData }) => {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [name, setName] = useState(userData.username);
  const [error, setError] = useState('');

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    reset,
  } = useForm<FormValues>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setError('');

      if (data.username === name) {
        setIsEditingUsername(false);
        return;
      }

      await ClientAxios.patch('/user/username', {
        username: data.username,
      });

      toast.success('Username updated successfully!');
      setIsEditingUsername(false);
      setName(data.username);
    } catch (error: unknown) {
      if ((error as any).isAxiosError) {
        const axiosError = error as AxiosError;

        // verify for throttling limit error
        if (axiosError.response?.status === 429) {
          toast.error('Too many requests! Please try again later.');
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

  useEffect(() => {
    setError(errors.username?.message ?? '');
  }, [errors.username?.message]);

  useEffect(() => {
    if (isEditingUsername) {
      reset({ username: name });
    } else {
      setError('');
    }
  }, [isEditingUsername, name, reset]);

  return (
    <Popover onOpenChange={() => setIsEditingUsername(false)}>
      <PopoverTrigger>
        <UserMenuButton userData={userData} />
      </PopoverTrigger>
      <PopoverContent
        // We use an inset shadow as a border below because using a border makes the popover arrow shift during animation due to the extra element size. The actual menu shadow is a drop-shadow CSS filter.
        className='w-fit p-[2px] pb-1.5 h-fit shadow-[inset_0px_0px_0px_2px_rgb(82_82_91)] drop-shadow-lg border-zinc-600 bg-zinc-800 text-white rounded-lg'
        sideOffset={5}
        align='end'
        alignOffset={-10}
        arrowPadding={10}
      >
        <PopoverArrow className='fill-zinc-600' />
        <div className='min-w-56 max-w-64'>
          {/* User */}
          <div className='flex flex-row gap-2 items-center p-4 pb-3'>
            <div className='h-8 w-8 aspect-square'>
              <Image
                width={32}
                height={32}
                src={userData.profileImage}
                alt=''
                className='rounded-full'
              />
            </div>
            <div className='flex-shrink min-w-0 flex flex-col leading-tight'>
              <div className='flex justify-start items-center gap-2'>
                {!isEditingUsername ? (
                  <>
                    <h4 className='truncate font-semibold w-[155px] py-px'>
                      {name}
                    </h4>
                    <button onClick={() => setIsEditingUsername(true)}>
                      <FontAwesomeIcon
                        icon={faPencil}
                        size='sm'
                        className='text-zinc-400 hover:text-zinc-200'
                      />
                    </button>
                  </>
                ) : (
                  <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input
                        className='w-[calc(12rem-55.5px)] font-semibold bg-transparent border border-zinc-400 rounded-md px-1'
                        defaultValue={name}
                        {...register('username', {
                          required: 'Username is required',
                          pattern: {
                            value: UserConst.ALLOWED_REGEXP,
                            message:
                              'Your username may only contain these characters: A-Z a-z 0-9 - _ .',
                          },
                          maxLength: {
                            value: UserConst.USERNAME_MAX_LENGTH,
                            message: `The username must be shorter than ${UserConst.USERNAME_MAX_LENGTH} characters`,
                          },
                          minLength: {
                            value: UserConst.USERNAME_MIN_LENGTH,
                            message: `The username must have at least ${UserConst.USERNAME_MIN_LENGTH} characters`,
                          },
                        })}
                      />
                      <button
                        className='ml-1'
                        disabled={isSubmitting}
                        type='submit'
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          size='lg'
                          className='text-zinc-400 hover:text-green-500'
                        />
                      </button>
                      <button
                        className='ml-1'
                        onClick={() => setIsEditingUsername(false)}
                      >
                        <FontAwesomeIcon
                          icon={faClose}
                          size='lg'
                          className='text-zinc-400 hover:text-red-500'
                        />
                      </button>
                    </form>
                  </>
                )}
              </div>
              <p className='text-zinc-300 text-xs truncate'>{userData.email}</p>
            </div>
          </div>
          {error && (
            <p className='text-xs text-red-400 px-4 pb-2 max-w-60 leading-tight'>
              {error}
            </p>
          )}
          {isEditingUsername && (
            <p className='text-xs text-zinc-500 px-4 pb-2 max-w-60 leading-tight'>
              NOTE: Your existing song files will{' '}
              <strong className='font-black'>not</strong> be updated. Make an
              edit to each song&apos;s title or description to refresh them!
            </p>
          )}

          <UserMenuSplitLine />

          {/* Links */}
          <div className='flex flex-col'>
            {/* <UserMenuLink href='/my-profile' icon={faUser} label='Profile' /> */}
            <UserMenuLink href='/my-songs' icon={faMusic} label='My songs' />
            <UserMenuLink href='/logout' icon={faSignOutAlt} label='Sign out' />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
