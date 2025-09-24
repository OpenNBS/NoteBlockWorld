import { cookies } from 'next/headers';

import axiosInstance from '../../../lib/axios';
import { LoggedUserData } from '../types/User';

export function getTokenServer(): { value: string } | null {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  return token as { value: string } | null;
}

export const checkLogin = async () => {
  // get token from cookies
  const token = getTokenServer();
  // if token is not null, redirect to home page
  if (!token) return false;
  if (!token.value) return false;

  try {
    // verify the token with the server
    const res = await axiosInstance.get('/auth/verify', {
      headers: {
        authorization: `Bearer ${token.value}`
      }
    });

    // if the token is valid, redirect to home page
    if (res.status === 200) return true;
    else return false;
  } catch {
    return false;
  }
};

export const getUserData = async (): Promise<LoggedUserData | never> => {
  // get token from cookies
  const token = getTokenServer();
  // if token is not null, redirect to home page
  if (!token) throw new Error('No token found');
  if (!token.value) throw new Error('No token found');

  try {
    // verify the token with the server
    const res = await axiosInstance.get('/user/me', {
      headers: {
        authorization: `Bearer ${token.value}`
      }
    });

    // if the token is valid, redirect to home page
    if (res.status === 200) return res.data as LoggedUserData;
    else throw new Error('Invalid token');
  } catch {
    throw new Error('Invalid token');
  }
};
