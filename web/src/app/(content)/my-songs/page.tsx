import { redirect } from 'next/navigation';

import { checkLogin } from '@web/src/modules/auth/features/auth.utils';
import Page from '@web/src/modules/my-songs/components/MySongsPage';

const MySongsPage = async () => {
  // TODO: Next.js extends fetch() to memoize the result of multiple requests to the same URL.
  // Can we use this to avoid the duplicate call to checkLogin()?
  // https://nextjs.org/docs/app/building-your-application/caching#request-memoization
  const isLogged = await checkLogin();
  if (!isLogged) redirect('/login?redirect=/my-songs');

  return <Page />;
};

export default MySongsPage;
