import axiosInstance from '@web/src/axios';
import DefaultLayout from '@web/src/components/Layout/DefaultLayout';
import UserProfile from '@web/src/components/User/UserProfile';
import { UserProfileData } from '@web/src/types/User';
import { cookies } from 'next/headers';

const getUserData = async (id: string): Promise<UserProfileData | never> => {
  try {
    const res = await axiosInstance.get(`/user/?id=${id}`);
    if (res.status === 200) return res.data as UserProfileData;
    else throw new Error('Failed to get user data');
  } catch {
    throw new Error('Failed to get user data');
  }
};

const UserPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    const userData = await getUserData(id);
    return (
      <main className='w-full h-full m-auto text-center bg-zinc-900 flex items-center justify-center'>
        <DefaultLayout>
          <UserProfile userData={userData} />
        </DefaultLayout>
      </main>
    );
  } catch {
    return (
      <main className='w-full h-full m-auto text-center bg-zinc-900 flex items-center justify-center'>
        <DefaultLayout>
          <h1>Failed to get user data</h1>
        </DefaultLayout>
      </main>
    );
  }
};

export default UserPage;
