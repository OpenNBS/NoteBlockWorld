import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { RegistrationPage } from '@web/src/modules/auth/components/RegistrationPage';
import { checkLogin } from '@web/src/modules/auth/features/auth.utils';

export const metadata: Metadata = {
  title: 'Sign in',
};

const Login = async () => {
  const isLogged = await checkLogin();
  if (isLogged) redirect('/');

  return <RegistrationPage />;
};

export default Login;
