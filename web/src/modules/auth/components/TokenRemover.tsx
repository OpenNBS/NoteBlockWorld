'use client';
import { deleteAuthCookies } from './client/login.util';

export const TokenRemover = () => {
  deleteAuthCookies();
  return <></>;
};
