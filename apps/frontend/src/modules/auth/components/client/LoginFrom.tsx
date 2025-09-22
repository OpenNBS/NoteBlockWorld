'use client';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import ClientAxios from '@web/lib/axios/ClientAxios';


import {
  Input,
  SubmitButton,
} from '../../../shared/components/client/FormElements';

type LoginFormData = {
  email: string;
};

const backendURL = process.env.NEXT_PUBLIC_API_URL;

// TODO: Implement login logic
export const LoginForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async ({ email }: LoginFormData) => {
    try {
      setIsLoading(true);
      const url = `${backendURL}/auth/login/magic-link`;

      const response = await ClientAxios.post(url, {
        destination: email,
      });

      console.log(response.data);

      toast.success(`A magic link has been sent to ${email}!`, {
        position: 'top-center',
        duration: 20_000, // 20 seconds
      });

      toast.success('It will stay valid for one hour!', {
        position: 'top-center',
        duration: 20_000, // 20 seconds
      });
    } catch (error) {
      if ((error as any).isAxiosError) {
        const axiosError = error as any;

        if (axiosError.response) {
          const { status } = axiosError.response;

          if (status === 429) {
            toast.error('Too many requests. Please try again later.', {
              position: 'top-center',
              duration: 20_000, // 20 seconds
            });
          } else {
            toast.error('An unexpected error occurred', {
              position: 'top-center',
              duration: 20_000, // 20 seconds
            });
          }
        }
      } else {
        toast.error('An unexpected error occurred', {
          position: 'top-center',
          duration: 20_000, // 20 seconds
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className={`flex flex-col gap-6`} onSubmit={handleSubmit(onSubmit)}>
        <div className='flex items-center justify-center gap-2 my-3 bg-cyan-800 border-cyan-400 text-cyan-300 border-2 rounded-lg px-3 py-2 text-sm'>
          <FontAwesomeIcon icon={faExclamationCircle} className='h-5' />
          <p>
            Please make sure to carefully review our{' '}
            <Link
              href='/guidelines'
              target='_blank'
              className='text-blue-400 hover:text-blue-300 hover:underline'
            >
              Community Guidelines
            </Link>{' '}
            before logging in!
          </p>
        </div>

        <div className='flex flex-col h-fit gap-6'>
          {/* Email */}
          <div>
            <Input
              id='email'
              label='Email*'
              tooltip={
                <>
                  <p>Enter your email address to log in.</p>
                </>
              }
              isLoading={isLoading}
              disabled={isLocked}
              errorMessage={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
          </div>

          <div className='flex flex-row items-center justify-end gap-8'>
            {/* Submit button */}
            <SubmitButton isDisabled={isLoading} />
          </div>
        </div>
      </form>
    </>
  );
};
