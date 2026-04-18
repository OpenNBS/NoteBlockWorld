import { cookies } from 'next/headers';

import axiosInstance from '../../../lib/axios';
import { LoggedUserData } from '../types/User';

export async function getTokenServer(): Promise<{ value: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  return token as { value: string } | null;
}

export const checkLogin = async () => {
  // get token from cookies
  const token = await getTokenServer();
  // if token is not null, redirect to home page
  if (!token) return false;
  if (!token.value) return false;

  try {
    // verify the token with the server
    const res = await axiosInstance.get('/auth/verify', {
      headers: {
        authorization: `Bearer ${token.value}`,
      },
    });

    // if the token is valid, redirect to home page
    if (res.status === 200) return true;
    else return false;
  } catch {
    return false;
  }
};

/** Returns the logged-in user id from the session cookie, or null if absent/invalid. */
export async function getViewerUserId(): Promise<string | null> {
  const token = await getTokenServer();
  if (!token?.value) return null;
  try {
    const res = await axiosInstance.get('/user/me', {
      headers: {
        authorization: `Bearer ${token.value}`,
      },
    });
    return (res.data as LoggedUserData).id;
  } catch {
    return null;
  }
}

export const getUserData = async (): Promise<LoggedUserData | never> => {
  // get token from cookies
  const token = await getTokenServer();
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
};
