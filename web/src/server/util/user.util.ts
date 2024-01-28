import { UserProfileData } from '@web/src/types/User';
import axiosInstance from '../../axios';

export const getUserProfileData = async (
  id: string
): Promise<UserProfileData | never> => {
  try {
    const res = await axiosInstance.get(`/user/?id=${id}`);
    if (res.status === 200) return res.data as UserProfileData;
    else throw new Error('Failed to get user data');
  } catch {
    throw new Error('Failed to get user data');
  }
};
