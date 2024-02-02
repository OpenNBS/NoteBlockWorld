import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { baseApiURL } from '@web/src/lib/axios';

import Link from 'next/link';
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
    <main className='w-screen h-screen p-6 text-center text-balance bg-zinc-900 flex items-center justify-center'>
      <div className='flex flex-col gap-4 bg-zinc-800 w-[480px] rounded-xl p-10'>
        <div>
          <h2 className='text-4xl mb-2'>Sign in</h2>
          <p>to discover, share and listen to note block music</p>
        </div>
        <div className='h-4'></div>
        {/* Login with Google */}
        <Link
          href={signIn('google')}
          className='flex items-center text-white outline outline-white outline-1 bg-none p-2.5 hover:outline-orange-500 hover:text-orange-500 hover:transition-all duration-200 uppercase rounded-lg'
        >
          <FontAwesomeIcon icon={faGoogle} className='align-middle mr-2 h-5' />
          <span className='flex-1 text-nowrap'>Login with Google</span>
        </Link>
        {/* Login with Github */}
        <Link
          href={signIn('github')}
          className='flex items-center text-white outline outline-white outline-1 bg-none p-2.5 hover:outline-orange-500 hover:text-orange-500 hover:transition-all duration-200 uppercase rounded-lg'
        >
          <FontAwesomeIcon icon={faGithub} className='align-middle mr-2 h-5' />
          <span className='flex-1'>Login with GitHub</span>
        </Link>
      </div>
    </main>
  );
};
