import axiosInstance from '../../../lib/axios';
import { UserProfileData } from '../../auth/types/User';

export const getUserProfileData = async (
  id: string,
): Promise<UserProfileData | never> => {
  try {
    const res = await axiosInstance.get(`/user/?id=${id}`);
    if (res.status === 200) {
      const user = (res.data as { users?: UserProfileData[] }).users?.[0];
      if (user) return user;
    }
    throw new Error('Failed to get user data');
  } catch {
    throw new Error('Failed to get user data');
  }
};
