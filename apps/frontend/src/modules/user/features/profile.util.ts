import type {
  PageDto,
  PublicProfileDto,
  SongPreviewDto,
} from '@nbw/validation';
import axiosInstance from '@web/lib/axios';

/** Profile URL uses normalized `username` (same rules as account username). */
export async function fetchPublicProfileByUsername(
  username: string,
): Promise<PublicProfileDto> {
  const encoded = encodeURIComponent(username);
  const res = await axiosInstance.get<PublicProfileDto>(
    `/profile/u/${encoded}`,
  );
  return res.data;
}

export async function fetchUserSongsByUploader(
  username: string,
  page: number,
  limit: number,
): Promise<PageDto<SongPreviewDto>> {
  const res = await axiosInstance.get<PageDto<SongPreviewDto>>('/song/', {
    params: {
      uploader: username,
      page,
      limit,
      sort: 'recent',
      order: 'desc',
    },
  });
  return res.data;
}
