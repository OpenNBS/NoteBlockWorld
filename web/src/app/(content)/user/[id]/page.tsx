import { ErrorBox } from '@web/src/modules/shared/components/client/ErrorBox';
import UserProfile from '@web/src/modules/user/components/UserProfile';
import { getUserProfileData } from '@web/src/modules/user/features/user.util';

const UserPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  let userData;

  try {
    userData = await getUserProfileData(id);
  } catch {
    userData = null;
  }

  return !userData ? (
    <ErrorBox message='Failed to get user data' />
  ) : (
    <UserProfile userData={userData} />
  );
};

export default UserPage;
