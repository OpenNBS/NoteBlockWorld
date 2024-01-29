import { checkLogin } from '@web/src/server/util/utils';
import { redirect } from 'next/navigation';
import { LoginPage } from './loginPage';

const Login = async () => {
  const isLogged = await checkLogin();
  if (isLogged) redirect('/browse');
  return <LoginPage />;
};

export default Login;
