import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';

import { baseApiURL } from '@web/src/lib/axios';

type AuthProvider = 'google' | 'github';

const getLoginUrl = (provider: AuthProvider) => {
  let AuthURL;
  switch (provider) {
    case 'google':
      AuthURL = baseApiURL + '/auth/login/google';
      break;
    case 'github':
      AuthURL = baseApiURL + '/auth/login/github';
      break;
    default:
      throw new Error('Invalid provider');
  }
  return AuthURL;
};
const signIn = (provider: AuthProvider) => {
  'use client';
  const url = getLoginUrl(provider);
  return url;
};

export const LoginPage = () => {
  return (
    <main className='w-screen h-screen p-6 text-center text-balance flex items-center justify-center'>
      <div className='flex flex-col sm:flex-row gap-8 sm:gap-12 bg-zinc-800 w-fit rounded-xl p-10'>
        {/* Left half */}
        <div className='flex flex-row sm:flex-col items-center justify-center gap-2 mr-[-2rem] sm:mr-0 sm:mb-[-2.5rem] animate-[nbw-glow_3s_ease-in-out_infinite]'>
          <Image
            src='/nbw-color.png'
            alt='Note Block World logo'
            className='w-[100px] sm:w-[128px]'
            width={150}
            height={150}
          />
          <Image
            src='/nbw-logo.png'
            width={150}
            height={100}
            alt=''
            className='relative right-8 sm:right-0 sm:bottom-10 resize-none min-w-[150px] max-w-[150px]'
          />
        </div>

        {/* Vertical divider (mobile) */}
        <div className='w-[1px] min-h-full hidden sm:block bg-zinc-600'></div>
        {/* Horizontal divider (desktop) */}
        <div className='h-[1px] min-w-full block sm:hidden bg-zinc-600'></div>

        {/* Right half */}
        <div className='flex flex-col justify-center gap-4'>
          <div className='flex flex-col'>
            <h2 className='text-4xl mb-2'>Sign in</h2>
            <p>to discover, share and listen to note block music</p>
          </div>
          <div className='h-4'></div>
          {/* Login with Google */}
          <Link
            href={signIn('google')}
            className='flex items-center text-white outline outline-white outline-1 bg-none p-2.5 hover:outline-orange-500 hover:text-orange-500 hover:transition-all duration-200 uppercase rounded-lg'
          >
            <FontAwesomeIcon
              icon={faGoogle}
              className='align-middle mr-2 h-5'
            />
            <span className='flex-1 text-nowrap'>Login with Google</span>
          </Link>
          {/* Login with Github */}
          <Link
            href={signIn('github')}
            className='flex items-center text-white outline outline-white outline-1 bg-none p-2.5 hover:outline-orange-500 hover:text-orange-500 hover:transition-all duration-200 uppercase rounded-lg'
          >
            <FontAwesomeIcon
              icon={faGithub}
              className='align-middle mr-2 h-5'
            />
            <span className='flex-1'>Login with GitHub</span>
          </Link>
        </div>
      </div>
    </main>
  );
};
