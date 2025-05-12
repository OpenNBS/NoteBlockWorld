import { ErrorBox } from '@web/src/modules/shared/components/client/ErrorBox';
import { UserProfile } from '@web/src/modules/user/components/UserProfile';
import {
  getUserProfileData,
  getUserSongs,
} from '@web/src/modules/user/features/user.util';

const UserPageEdit = async ({ params }: { params: { username: string } }) => {
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

  if (userData) {
    // set the page title to the user's name

    return <UserProfile userData={userData} songData={songData} />;
  } else {
    return <ErrorBox message='Failed to get user data' />;
  }
};

export default UserPageEdit;
