import { redirect } from 'next/navigation';
import { LoginPage } from './loginPage';
import { checkLogin } from '@web/src/modules/auth/features/auth.utils';
import { TokenRemover } from '@web/src/modules/auth/components/TokenRemover';

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
