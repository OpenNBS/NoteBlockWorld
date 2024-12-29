'use client';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ErrorBalloon } from '@web/src/modules/shared/components/client/ErrorBalloon';

import {
  Input,
  SubmitButton,
} from '../../../shared/components/client/FormElements';

type LoginFormProps = {
  isLoading?: boolean;
  isLocked?: boolean;
};

type LoginFormData = {
  email: string;
  password: string;
};

// TODO: Implement login logic
export const LoginForm = ({
  isLoading = false,
  isLocked = false,
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    // Handle login logic here
    console.log(data);
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

          {/* Password */}
          <div>
            <Input
              id='password'
              label='Password*'
              type='password'
              tooltip={
                <>
                  <p>Enter your password to log in.</p>
                </>
              }
              isLoading={isLoading}
              disabled={isLocked}
              errorMessage={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />
          </div>

          {errors.email && <ErrorBalloon message={errors.email.message} />}
          {errors.password && (
            <ErrorBalloon message={errors.password.message} />
          )}

          <div className='flex flex-row items-center justify-end gap-8'>
            {/* Submit button */}
            <SubmitButton isDisabled={isLoading} />
          </div>

          {/* Link to registration page */}
          <div className='flex items-center justify-center gap-2 my-3'>
            <p>
              Don't have an account?{' '}
              <Link
                href='/register'
                className='text-blue-400 hover:text-blue-300 hover:underline'
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
};
