import axiosInstance from '@web/lib/axios';

export const getUserSongs = async (userId: string) => {
  const res = await axiosInstance.get('/song/user', {
    params: {
      id: userId,
    },
  });

  return res.data;
};
