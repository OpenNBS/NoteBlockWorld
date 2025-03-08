import { ErrorBox } from '@web/src/modules/shared/components/client/ErrorBox';
import UserProfile from '@web/src/modules/user/components/UserProfile';
import {
  getUserProfileData,
  getUserSongs,
} from '@web/src/modules/user/features/user.util';

const UserPage = async ({ params }: { params: { username: string } }) => {
  const { username } = params;

  let userData = null;
  let songData = null;

  try {
    userData = await getUserProfileData(username);
  } catch (e) {
    console.error('Failed to get user data:', e);
  }

  try {
    songData = await getUserSongs(username);
  } catch (e) {
    console.error('Failed to get song data:', e);
  }

  return !userData ? (
    <ErrorBox message='Failed to get user data' />
  ) : (
    <UserProfile userData={userData} songData={songData} />
  );
};

export default UserPage;
