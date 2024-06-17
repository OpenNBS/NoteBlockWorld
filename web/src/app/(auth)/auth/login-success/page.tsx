'use client';

const LoginSuccessPage = () => {
  function signIn() {
    // get query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refresh_token');
    const user = params.get('user');
    // set cookies
    document.cookie = `token=${token}; path=/; max-age=3600; SameSite=None; Secure`;
    document.cookie = `refresh_token=${refreshToken}; path=/; max-age=3600; SameSite=None; Secure`;
    document.cookie = `user=${user}; path=/; max-age=3600; SameSite=None; Secure`;
    // redirect to home
    window.location.href = '/';
  }

  if (typeof window !== 'undefined') {
    signIn();
  }

  return (
    <>
      <h1 className='text-center text-4xl'>Redirecting...</h1>
      <a href='/'>Click here if you are not redirected</a>
    </>
  );
};

export default LoginSuccessPage;
