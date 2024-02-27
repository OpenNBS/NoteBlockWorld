import { redirect } from 'next/navigation';

import { TokenRemover } from '@web/src/modules/auth/components/TokenRemover';
import { checkLogin } from '@web/src/modules/auth/features/auth.utils';

import { LoginPage } from './loginPage';

const Login = async () => {
  const isLogged = await checkLogin();
  if (isLogged) redirect('/browse');
  // get query params
  return (
    <>
      <LoginPage />
      <TokenRemover />
    </>
  );
};

export default Login;
