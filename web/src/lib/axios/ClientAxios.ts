import axios from 'axios';

import { getTokenLocal } from './token.utils';

export const baseApiURL = process.env.NEXT_PUBLIC_API_URL;

const ClientAxios = axios.create({
  baseURL: baseApiURL,
  withCredentials: true,
});

// Add a request interceptor to add the token to the request
ClientAxios.interceptors.request.use(
  (config) => {
    try {
      const token = getTokenLocal();

      config.headers.authorization = `Bearer ${token}`;

      return config;
    } catch {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default ClientAxios;
