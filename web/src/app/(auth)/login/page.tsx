import { checkLogin } from '@web/src/server/util/utils';
import { redirect } from 'next/navigation';
import { LoginPage } from './loginPage';
import { TokenRemover } from '@web/src/client/components/User/TokenRemover';

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
