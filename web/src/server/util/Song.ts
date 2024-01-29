import axiosInstance from '@web/src/axios';

export const getUserSongs = async (userId: string) => {
  const res = await axiosInstance.get('/song/user', {
    params: {
      id: userId,
    },
  });
  return res.data;
};
