import axios from 'axios';

export const baseApiURL = 'http://localhost:4000/api/v1';

const axiosInstance = axios.create({
  baseURL: baseApiURL,
  withCredentials: true,
});

export default axiosInstance;
