import axios from 'axios';

export const baseApiURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL        : baseApiURL,
  withCredentials: true,
});

export default axiosInstance;
