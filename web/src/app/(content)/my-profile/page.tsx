import { redirect } from 'next/navigation';

import axiosInstance from '@web/src/lib/axios';
import {
  checkLogin,
  getTokenServer,
} from '@web/src/modules/auth/features/auth.utils';

async function fetchSelfProfile() {
  // get token from cookies
  const token = getTokenServer();
  // if token is not null, redirect to home page
  if (!token) return {};
  if (!token.value) return {};

  try {
    const res = await axiosInstance.get('/user/me', {
      headers: {
        authorization: `Bearer ${token.value}`,
      },
    });
    return res.data;
  } catch (error: any) {
    // Remove type annotation from catch clause variable
    console.error(error.response.data);
    return null;
  }
}

const MySongsPage = async () => {
  // TODO: Next.js extends fetch() to memoize the result of multiple requests to the same URL.
  // Can we use this to avoid the duplicate call to checkLogin()?
  // https://nextjs.org/docs/app/building-your-application/caching#request-memoization
  const isLogged = await checkLogin();
  if (!isLogged) redirect('/login?redirect=/my-songs');
  const user = await fetchSelfProfile();
  console.log(user);
  if (!user) return redirect('/login?redirect=/my-songs');

  return (
    <p
      style={{
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
    >
      {JSON.stringify(user, null, 2)}
    </p>
  );
};

export default MySongsPage;
