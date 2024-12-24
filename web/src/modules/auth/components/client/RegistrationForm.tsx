'use client';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ErrorBalloon } from '@web/src/modules/shared/components/client/ErrorBalloon';
import { ErrorBox } from '@web/src/modules/shared/components/client/ErrorBox';
import {
  Input,
  SubmitButton,
} from '../../../shared/components/client/FormElements';
import { useForm, SubmitHandler } from 'react-hook-form';

type RegisterFormProps = {
  isLoading?: boolean;
  isLocked?: boolean;
};

type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

// TODO: Implement registration logic
export const RegistrationForm = ({
  isLoading = false,
  isLocked = false,
}: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    // Handle registration logic here
    console.log(data);
  };

  const password = watch('password');

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
            before registering!
          </p>
        </div>

        <div className='flex flex-col h-fit gap-2'>
          {/* Email */}
          <div>
            <Input
              id='email'
              label='Email*'
              tooltip={
                <>
                  <p>Enter your email address to register.</p>
                </>
              }
              isLoading={isLoading}
              disabled={isLocked}
              errorMessage={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
          </div>

          {/* Username */}
          <div>
            <Input
              id='username'
              label='Username*'
              tooltip={
                <>
                  <p>Enter your desired username.</p>
                </>
              }
              isLoading={isLoading}
              disabled={isLocked}
              errorMessage={errors.username?.message}
              {...register('username', { required: 'Username is required' })}
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
                  <p>Enter your password to register.</p>
                </>
              }
              isLoading={isLoading}
              disabled={isLocked}
              errorMessage={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <Input
              id='confirmPassword'
              label='Confirm Password*'
              type='password'
              tooltip={
                <>
                  <p>Confirm your password.</p>
                </>
              }
              isLoading={isLoading}
              disabled={isLocked}
              errorMessage={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
          </div>

          {errors.email && <ErrorBalloon message={errors.email.message} />}
          {errors.username && (
            <ErrorBalloon message={errors.username.message} />
          )}
          {errors.password && (
            <ErrorBalloon message={errors.password.message} />
          )}
          {errors.confirmPassword && (
            <ErrorBalloon message={errors.confirmPassword.message} />
          )}

          <div className='flex flex-row items-center justify-end gap-8'>
            {/* Submit button */}
            <SubmitButton isDisabled={isLoading} />
          </div>

          {/* Link to login page */}
          <div className='flex items-center justify-center gap-2 my-3'>
            <p>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-blue-400 hover:text-blue-300 hover:underline'
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
};
