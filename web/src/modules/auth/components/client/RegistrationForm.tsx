'use client';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  RegistrationFormSchema,
  RegistrationFormType,
} from './RegistrationForm.zod';
import { Button, Input } from '../../../shared/components/client/FormElements';

type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

// TODO: Implement registration logic
export const RegistrationForm = () => {
  const formMethods = useForm<RegistrationFormType>({
    resolver: zodResolver(RegistrationFormSchema),
    mode: 'onBlur',
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
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
              errorMessage={errors.username?.message}
              {...register('username', { required: 'Username is required' })}
            />
          </div>

          <div className='flex flex-row items-center justify-end gap-8'>
            {/* Submit button */}
            <Button onClick={handleSubmit(onSubmit)}>Register</Button>
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
