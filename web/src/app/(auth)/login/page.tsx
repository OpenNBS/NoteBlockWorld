import { redirect } from 'next/navigation';

import { LoginPage } from '@web/src/modules/auth/components/loginPage';
import { TokenRemover } from '@web/src/modules/auth/components/TokenRemover';
import { checkLogin } from '@web/src/modules/auth/features/auth.utils';

const Login = async () => {
  const isLogged = await checkLogin();
  if (isLogged) redirect('/');

  // get query params
  return (
    <>
      <LoginPage />
      <TokenRemover />
    </>
  );
};

export default Login;
