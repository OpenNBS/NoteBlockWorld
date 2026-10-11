import axios from 'axios';

/** Default matches `.env.local.example` so SSR (e.g. profile page) hits the API when env is unset in dev. */
export const baseApiURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: baseApiURL,
  withCredentials: true,
});

export default axiosInstance;
