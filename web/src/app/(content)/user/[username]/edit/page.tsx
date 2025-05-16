import { ErrorBox } from '@web/src/modules/shared/components/client/ErrorBox';
import { getUserProfileData } from '@web/src/modules/user/features/user.util';

import { UserEditProfile } from './UserEditProfile';

const UserPageEdit = async ({ params }: { params: { username: string } }) => {
  const { username } = params;

  let userData = null;

  try {
    userData = await getUserProfileData(username);
  } catch (e) {
    console.error('Failed to get user data:', e);
  }

  if (userData) {
    return <UserEditProfile initialUserData={userData} />;
  } else {
    return <ErrorBox message='Failed to get user data' />;
  }
};

export default UserPageEdit;
