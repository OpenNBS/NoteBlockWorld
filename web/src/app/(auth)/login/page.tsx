import axiosInstance from '@web/src/axios';
import { cookies } from 'next/headers';
import { LoginPage } from './loginPage';
import { redirect } from 'next/navigation';
const CheckLogin = async () => {
  // get token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  // if token is not null, redirect to home page
  if (token) {
    redirect('/browser');
  }

  // verify the token with the server
  const res = await axiosInstance.get('/auth/verify', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // if the token is valid, redirect to home page
  if (res.status === 200) {
    redirect('/browser');
  }
  redirect('/login');
};

const Login = () => {
  CheckLogin();
  return (
    <main className='w-full h-full m-auto text-center bg-zinc-900 flex items-center justify-center'>
      <LoginPage />
    </main>
  );
};

export default Login;