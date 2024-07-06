import { cookies } from 'next/headers';

import axiosInstance from '../../../lib/axios';
import { LoggedUserData } from '../types/User';

export function getTokenServer(): { value: string } | null {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  return token as { value: string } | null;
}

export function getRefreshTokenServer(): { value: string } | null {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refresh_token');

  return refreshToken as { value: string } | null;
}

export async function checkLogin() {
  // get token from cookies
  let token = getTokenServer();
  let refreshToken = getRefreshTokenServer();

  // if there's no refresh token, user has to log in again
  if (!refreshToken || !refreshToken.value) {
    return false;
  }

  //  if there's a refresh token but no token,
  // get a new one with the refresh token
  if (!token || !token.value) {
    // if the token is invalid, try to refresh the token
    const { token: newToken, refreshToken: newRefreshToken } =
      await refreshAuthToken(refreshToken);

    token = { value: newToken };
    refreshToken = { value: newRefreshToken };
  }

  // both tokens are valid, return true
  return true;

  /*
  try {
    // verify the token with the server
    const res = await axiosInstance.get('/auth/verify', {
      headers: {
        authorization: `Bearer ${token.value}`,
      },
    });

    // if the token is valid, redirect to home page
    if (res.status === 200) return true;
  } catch {
    console.debug('Invalid token');
    return false;
  }

  return false;
*/
}

async function refreshAuthToken(refreshToken: { value: string }) {
  try {
    const res = await axiosInstance.get<{
      refresh_token: string;
      token: string;
    }>('/auth/refresh', {
      headers: {
        authorization: `Bearer ${refreshToken.value}`,
      },
    });

    const responseData = res.data;

    const refreshTokenData = JSON.parse(
      atob(responseData.refresh_token.split('.')[1]),
    ) as { exp: number };

    const tokenData = JSON.parse(atob(responseData.token.split('.')[1])) as {
      exp: number;
    };

    // get res cookies and forward them to the client
    const cookieStore = cookies();

    // set new tokens in cookies
    cookieStore.set('token', responseData.token, {
      expires: new Date(new Date().getTime() + tokenData.exp * 1000),
    });

    cookieStore.set('refresh_token', responseData.refresh_token, {
      expires: new Date(new Date().getTime() + refreshTokenData.exp * 1000),
    });

    return {
      token: responseData.token,
      refreshToken: responseData.refresh_token,
    };
  } catch (e) {
    console.error(e);
    return { token: '', refreshToken: '' };
  }
}

export async function getUserData(): Promise<LoggedUserData | never> {
  // get token from cookies
  const token = getTokenServer();
  // if token is not null, redirect to home page
  if (!token) throw new Error('No token found');
  if (!token.value) throw new Error('No token found');

  try {
    // verify the token with the server
    const res = await axiosInstance.get('/user/me', {
      headers: {
        authorization: `Bearer ${token.value}`,
      },
    });

    // if the token is valid, redirect to home page
    if (res.status === 200) return res.data as LoggedUserData;
    else throw new Error('Invalid token');
  } catch {
    throw new Error('Invalid token');
  }
}
