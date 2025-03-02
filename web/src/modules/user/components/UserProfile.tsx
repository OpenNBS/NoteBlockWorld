import Image from 'next/image';

import { SocialLinksTypes, UserProfileData } from '../../auth/types/User';

type UserProfileProps = {
  userData: UserProfileData;
};

const UserProfile = ({ userData }: UserProfileProps) => {
  const {
    lastLogin,
    loginStreak,
    playCount,
    publicName,
    description,
    profileImage,
    socialLinks,
  } = userData;

  return (
    <section className='w-full h-full'>
      <Image
        src={profileImage}
        alt={publicName}
        className='w-32 h-32 rounded-full'
        width={128}
        height={128}
      />
      <h1 className='text-2xl font-bold'>{publicName}</h1>
      <p className='text-gray-500'>{description}</p>
      <p className='text-gray-500'>Last Login: {lastLogin.toLocaleString()}</p>
      <p className='text-gray-500'>Login Streak: {loginStreak}</p>
      <p className='text-gray-500'>Play Count: {playCount}</p>
      <ul className='mt-4'>
        {Object.keys(socialLinks).map((key, index) => {
          const link = socialLinks[key as SocialLinksTypes];
          if (!link) return null;

          return (
            <li key={index}>
              <a href={link} className='text-blue-500 hover:underline'>
                {key}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default UserProfile;
