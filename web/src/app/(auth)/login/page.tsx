import { checkLogin } from '@web/src/server/util/utils';
import { redirect } from 'next/navigation';
import { LoginPage } from './loginPage';

const Login = async () => {
  const isLogged = await checkLogin();
  if (isLogged) redirect('/browse');
  return (
    <main className='w-full h-full m-auto text-center bg-zinc-900 flex items-center justify-center'>
      <LoginPage />
    </main>
  );
};

export default Login;
