import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { UserProfileViewDto } from '@shared/validation/user/dto/UserProfileView.dto';
import Image from 'next/image';

import { EarlySupporterBadge } from './UserBadges';
import UserSocialIcon from './UserSocialIcon';
import SongCard from '../../browse/components/SongCard';
import SongCardGroup from '../../browse/components/SongCardGroup';
import { formatTimeAgo } from '../../shared/util/format';

type UserProfileProps = {
  userData: UserProfileViewDto;
  songData: SongPreviewDto[] | null;
};

const UserProfile = ({ userData, songData }: UserProfileProps) => {
  const { lastSeen, username, description, profileImage } = userData;

  return (
    <div className='max-w-screen-lg mx-auto'>
      {/* HEADER */}
      <section>
        <div className='flex items-center gap-8'>
          <Image
            src={profileImage}
            alt={username}
            className='w-32 h-32 rounded-full'
            width={128}
            height={128}
          />
          <div>
            {/* Display name */}
            <div className='flex items-center gap-8'>
              <h1 className='text-3xl font-bold mb-1 relative'>{username}</h1>
              <EarlySupporterBadge />
            </div>

            {/* Username/handle */}
            <p className='text-zinc-400 my-1'>
              <span className='font-black text-zinc-200'>{`@${username}`}</span>
              {` • 5 songs • 2,534 plays`}
            </p>

            {/* Description */}
            <p className='text-zinc-400 my-1 line-clamp-3'>
              Hello! This is my user description.
            </p>

            {/* Social links */}
            <div className='flex-grow flex flex-row gap-1.5 mt-4'>
              <UserSocialIcon icon='twitter' href='#' />
              <UserSocialIcon icon='youtube' href='#' />
              <UserSocialIcon icon='github' href='#' />
              <UserSocialIcon icon='discord' href='#' />
              <UserSocialIcon icon='patreon' href='#' />
            </div>
          </div>
          <div className='flex-grow'></div>
          <div>
            {/* Joined */}
            <p className='text-zinc-500'>Joined</p>
            <p className='font-bold text-zinc-400 mb-4'>
              {/* TODO: lastSeen is supposed to be a date, but it's a string */}
              {new Date(lastSeen).toLocaleDateString('en-UK')}
              <span className='font-normal text-zinc-400'>{` (${formatTimeAgo(
                new Date(lastSeen),
              )})`}</span>
            </p>

            {/* Last seen */}
            <p className='text-zinc-500'>Last seen</p>
            <p className='font-bold text-zinc-400'>
              {/* TODO: lastSeen is supposed to be a date, but it's a string */}
              {new Date(lastSeen).toLocaleDateString('en-UK')}
              <span className='font-normal text-zinc-400'>{` (${formatTimeAgo(
                new Date(lastSeen),
              )})`}</span>
            </p>
          </div>
        </div>
      </section>

      <hr className='my-8 border-none bg-zinc-700 h-[3px]' />

      {/* UPLOADED SONGS */}
      <section>
        <h2 className='flex-1 text-xl uppercase mb-4 text-zinc-200'>Songs</h2>
        <SongCardGroup>
          {songData?.map((song, i) => (
            <SongCard key={i} song={song} />
          ))}
        </SongCardGroup>
      </section>
    </div>
  );
};

export default UserProfile;
