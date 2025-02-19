import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginPage } from '@web/src/modules/auth/components/loginPage';
import { checkLogin } from '@web/src/modules/auth/features/auth.utils';

export const metadata: Metadata = {
  title: 'Sign in',
};

const Login = async () => {
  const isLogged = await checkLogin();
  if (isLogged) redirect('/');

  return <LoginPage />;
};

export default Login;
