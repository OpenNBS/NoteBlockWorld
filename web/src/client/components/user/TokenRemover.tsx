'use client';
import { deleteAuthCookies } from '../utils/login.util';

export const TokenRemover = () => {
  deleteAuthCookies();
  return <></>;
};
