import {
  faDiscord,
  faGithub,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { baseApiURL } from '@web/src/lib/axios';

import { CopyrightFooter } from '../../shared/components/layout/CopyrightFooter';
import { NoteBlockWorldLogo } from '../../shared/components/NoteBlockWorldLogo';

type AuthProvider = 'google' | 'github' | 'discord';

const getLoginUrl = (provider: AuthProvider) => {
  let AuthURL;

  switch (provider) {
    case 'google':
      AuthURL = baseApiURL + '/auth/login/google';
      break;
    case 'github':
      AuthURL = baseApiURL + '/auth/login/github';
      break;
    case 'discord':
      AuthURL = baseApiURL + '/auth/login/discord';
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
    <main
      data-test='login-page'
      className='w-full h-screen p-6 text-center text-balance flex flex-col items-center justify-center'
    >
      <div className='flex flex-col sm:flex-row gap-8 sm:gap-12 bg-zinc-900/30 backdrop-blur-md w-fit max-w-2xl rounded-2xl p-10'>
        {/* Left half */}
        <NoteBlockWorldLogo glow={true} orientation='adaptive' size={128} />

        {/* Vertical divider (mobile) */}
        <div className='w-[1px] min-h-full hidden sm:block bg-zinc-600'></div>
        {/* Horizontal divider (desktop) */}
        <div className='h-[1px] min-w-full block sm:hidden bg-zinc-600'></div>

        {/* Right half */}
        <div className='flex flex-col justify-center items-center gap-5'>
          <div className='flex flex-col mb-5'>
            <h2 className='text-4xl mb-2'>Sign in</h2>
            <p>to discover, share and listen to note block music</p>
          </div>

          <div className='bg-yellow-700 border-yellow-300 text-yellow-300 border-2 rounded-lg px-3 py-2 text-sm'>
            <FontAwesomeIcon
              icon={faClock}
              className='h-4 relative float-left'
            />
            We are running on a whitelist for the beta stage. Please wait for an
            invitation to sign in!
          </div>

          <div className='flex flex-col w-full gap-4'>
            {/* Login with Google */}
            <Link
              data-test='login-google'
              href={signIn('google')}
              className='flex items-center text-white outline outline-white outline-1 bg-none p-2.5 hover:outline-blue-500 hover:text-blue-500 hover:transition-all duration-200 uppercase rounded-lg'
            >
              <FontAwesomeIcon
                icon={faGoogle}
                className='align-middle mr-2 h-5'
              />
              <span className='flex-1 text-nowrap'>Log in with Google</span>
            </Link>
            {/* Login with Github */}
            <Link
              data-test='login-github'
              href={signIn('github')}
              className='flex items-center text-white outline outline-white outline-1 bg-none p-2.5 hover:outline-blue-500 hover:text-blue-500 hover:transition-all duration-200 uppercase rounded-lg'
            >
              <FontAwesomeIcon
                icon={faGithub}
                className='align-middle mr-2 h-5'
              />
              <span className='flex-1'>Log in with GitHub</span>
            </Link>
            {/* Login with Discord */}
            <Link
              data-test='login-discord'
              href={signIn('discord')}
              className='flex items-center text-white outline outline-white outline-1 bg-none p-2.5 hover:outline-blue-500 hover:text-blue-500 hover:transition-all duration-200 uppercase rounded-lg'
            >
              <FontAwesomeIcon
                icon={faDiscord}
                className='align-middle mr-2 h-5'
              />
              <span className='flex-1 text-nowrap'>Log in with Discord</span>
            </Link>
          </div>

          <p className='text-xs whitespace-normal w-3/4 text-zinc-400'>
            By signing in, you agree to our{' '}
            <Link
              className='text-blue-400 hover:underline'
              data-test='login-terms'
              href='/terms'
            >
              Terms of Service
            </Link>{' '}
            and that we process your information according to our{' '}
            <Link
              className='text-blue-400 hover:underline'
              data-test='login-privacy'
              href='/privacy'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
      <CopyrightFooter className='fixed bottom-4' />
    </main>
  );
};
