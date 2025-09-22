import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginWithEmailPage } from '@web/modules/auth/components/loginWithEmailPage';
import { checkLogin } from '@web/modules/auth/features/auth.utils';


export const metadata: Metadata = {
  title: 'Sign in',
};

const Login = async () => {
  const isLogged = await checkLogin();
  if (isLogged) redirect('/');

  return <LoginWithEmailPage />;
};

export default Login;
