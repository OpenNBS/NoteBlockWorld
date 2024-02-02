import UserProfile from '@web/src/modules/user/components/UserProfile';
import { getUserProfileData } from '@web/src/modules/user/features/user.util';
import Layout from '../../../layout';

const UserPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    const userData = await getUserProfileData(id);
    return (
      <main className='w-full h-full m-auto text-center bg-zinc-900 flex items-center justify-center'>
        <Layout>
          <UserProfile userData={userData} />
        </Layout>
      </main>
    );
  } catch {
    return (
      <main className='w-full h-full m-auto text-center bg-zinc-900 flex items-center justify-center'>
        <Layout>
          <h1>Failed to get user data</h1>
        </Layout>
      </main>
    );
  }
};

export default UserPage;
