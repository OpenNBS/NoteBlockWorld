'use client';
import { deepFreeze } from '@shared/validation/common/deepFreeze';
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { UserProfileViewDto } from '@shared/validation/user/dto/UserProfileView.dto';
import Image from 'next/image';
import { useEffect } from 'react';
import { z as zod } from 'zod';
import { create } from 'zustand';

import { EarlySupporterBadge } from './UserBadges';
import UserSocialIcon from './UserSocialIcon';
import SongCard from '../../browse/components/SongCard';
import SongCardGroup from '../../browse/components/SongCardGroup';
import { formatTimeAgo } from '../../shared/util/format';

type UserProfileProps = {
  initialUserData: UserProfileViewDto;
  songData: SongPreviewDto[] | null;
  isSelf?: boolean;
};

export const LinkRegexes = deepFreeze({
  bandcamp: /https?:\/\/[a-zA-Z0-9_-]+\.bandcamp\.com\/?/,
  discord: /https?:\/\/(www\.)?discord\.com\/[a-zA-Z0-9_]+/,
  facebook: /https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_]+/,
  github: /https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+/,
  instagram: /https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_]+/,
  reddit: /https?:\/\/(www\.)?reddit\.com\/user\/[a-zA-Z0-9_-]+/,
  snapchat: /https?:\/\/(www\.)?snapchat\.com\/add\/[a-zA-Z0-9_-]+/,
  soundcloud: /https?:\/\/(www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+/,
  spotify: /https?:\/\/open\.spotify\.com\/artist\/[a-zA-Z0-9?&=]+/,
  steam: /https?:\/\/steamcommunity\.com\/id\/[a-zA-Z0-9_-]+/,
  telegram: /https?:\/\/(www\.)?t\.me\/[a-zA-Z0-9_]+/,
  tiktok: /https?:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9_]+/,
  threads: /https?:\/\/(www\.)?threads\.net\/@?[a-zA-Z0-9_]+/,
  twitch: /https?:\/\/(www\.)?twitch\.tv\/[a-zA-Z0-9_]+/,
  x: /https?:\/\/(www\.)?x\.com\/[a-zA-Z0-9_]+/,
  youtube: /https?:\/\/(www\.)?youtube\.com\/@?[a-zA-Z0-9_-]+/,
});

const socialLinksSchema = zod.object({
  bandcamp: zod.string().regex(LinkRegexes.bandcamp).optional(),
  discord: zod.string().regex(LinkRegexes.discord).optional(),
  facebook: zod.string().regex(LinkRegexes.facebook).optional(),
  github: zod.string().regex(LinkRegexes.github).optional(),
  instagram: zod.string().regex(LinkRegexes.instagram).optional(),
  reddit: zod.string().regex(LinkRegexes.reddit).optional(),
  snapchat: zod.string().regex(LinkRegexes.snapchat).optional(),
  soundcloud: zod.string().regex(LinkRegexes.soundcloud).optional(),
  spotify: zod.string().regex(LinkRegexes.spotify).optional(),
  steam: zod.string().regex(LinkRegexes.steam).optional(),
  telegram: zod.string().regex(LinkRegexes.telegram).optional(),
  tiktok: zod.string().regex(LinkRegexes.tiktok).optional(),
  threads: zod.string().regex(LinkRegexes.threads).optional(),
  twitch: zod.string().regex(LinkRegexes.twitch).optional(),
  x: zod.string().regex(LinkRegexes.x).optional(),
  youtube: zod.string().regex(LinkRegexes.youtube).optional(),
});

const userProfileEditFormSchema = zod.object({
  username: zod.string().min(3).max(20),
  description: zod.string().optional(),
  socialLinks: socialLinksSchema,
});

type UserProfileEditFormSchema = zod.infer<typeof userProfileEditFormSchema>;

type UserProfileEditStore = {
  isLoading: boolean;
  isLocked: boolean;
  userData: UserProfileViewDto | null;
  setUserData: (data: UserProfileViewDto) => void;
  updateUserData: (data: Partial<UserProfileViewDto>) => void;
};

const useUserProfileEdit = create<UserProfileEditStore>((set, get) => {
  return {
    isLoading: true,
    isLocked: true,
    userData: null,
    setUserData: (data: UserProfileViewDto) => {
      set({ userData: data });
      set({ isLoading: false });
      set({ isLocked: false });
    },
    updateUserData: (data: Partial<UserProfileViewDto>) => {
      set({ isLoading: true });
      set({ isLocked: true });

      // TODO: do some fetch to update the user data

      // update the user data in the store
      set({
        userData: {
          ...get().userData,
          ...data,
        } as UserProfileViewDto,
      });

      set({ isLoading: false });
      set({ isLocked: false });
    },
  };
});

export const UserProfile: React.FC<UserProfileProps> = ({
  initialUserData,
  songData,
  isSelf = false, // isSelf decides if the user is viewing their own profile
}) => {
  const { lastSeen, username, description, profileImage, socialLinks } =
    initialUserData;

  const { setUserData, isLoading, isLocked, userData } = useUserProfileEdit();


  
  useEffect(() => {
    setUserData(initialUserData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUserData]);

  return (
    <div className='max-w-screen-lg mx-auto'>
      {/* HEADER */}
      <section>
        <div className='flex items-center gap-8'>
          <Image
            src={profileImage}
            alt={`Profile picture of ${username}`}
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
              {` • ${songData?.length || 0} songs • 2,534 plays`}{' '}
              {/* Dynamic song count */}
            </p>

            {/* Description */}
            <p className='text-zinc-400 my-1 line-clamp-3'>
              {description || 'No description available.'}{' '}
              {/* Dynamic description */}
            </p>

            {/* Social links */}
            <div className='flex-grow flex flex-row gap-1.5 mt-4'>
              {Object.entries(socialLinks).map(([key, value], i) => (
                <UserSocialIcon key={i} icon={key} href={value} />
              ))}
            </div>
          </div>

          <div className='flex-grow'></div>

          <div>
            {/* Joined */}
            <p className='text-zinc-500'>Joined</p>
            <p className='font-bold text-zinc-400 mb-4'>
              {new Date(lastSeen).toLocaleDateString('en-UK')}
              <span className='font-normal text-zinc-400'>{` (${formatTimeAgo(
                new Date(lastSeen),
              )})`}</span>
            </p>

            {/* Last seen */}
            <p className='text-zinc-500'>Last seen</p>
            <p className='font-bold text-zinc-400'>
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
        {songData ? (
          <SongCardGroup>
            {songData.map((song, i) => (
              <SongCard key={i} song={song} />
            ))}
          </SongCardGroup>
        ) : (
          <p className='text-zinc-400'>No songs uploaded yet.</p>
        )}
      </section>
    </div>
  );
};
