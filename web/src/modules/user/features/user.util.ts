import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import type { UserProfileViewDto } from '@shared/validation/user/dto/UserProfileView.dto';

import axiosInstance from '../../../lib/axios';

export const getUserProfileData = async (username: string) => {
  try {
    const res = await axiosInstance.get<UserProfileViewDto>(
      `/user/${username}`,
    );

    if (res.status === 200) return res.data;
    else throw new Error('Failed to get user data');
  } catch {
    throw new Error('Failed to get user data');
  }
};

export const getUserSongs = async (username: string) => {
  try {
    const res = await axiosInstance.get<SongPreviewDto[]>(`/song`, {
      params: {
        limit: 12,
        user: username,
      },
    });

    if (res.status === 200) return res.data;
    else throw new Error('Failed to get user songs');
  } catch {
    throw new Error('Failed to get user songs');
  }
};
