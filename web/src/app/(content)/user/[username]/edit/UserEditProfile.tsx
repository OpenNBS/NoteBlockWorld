'use client';

import {
  faExclamationCircle,
  faExternalLink,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { deepFreeze } from '@shared/validation/common/deepFreeze';
import type { UserProfileViewDto } from '@shared/validation/user/dto/UserProfileView.dto';
import Link from 'next/link';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { create } from 'zustand';

import {
  Input,
  TextArea,
} from '@web/src/modules/shared/components/client/FormElements';

type UserProfileEditStore = {
  isLoading: boolean;
  isLocked: boolean;
  userData: UserProfileViewDto | null;
  setUserData: (data: UserProfileViewDto) => void;
  updateUserData: (data: Partial<UserProfileViewDto>) => void;
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
  description: zod.string().optional(),
  socialLinks: socialLinksSchema,
});

type UserProfileEditFormSchema = zod.infer<typeof userProfileEditFormSchema>;

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

type UserEditProfileProps = {
  initialUserData: UserProfileViewDto;
};

export const UserEditProfile: React.FC<UserEditProfileProps> = ({
  initialUserData,
}) => {
  const { setUserData, isLoading, isLocked } = useUserProfileEdit();

  useEffect(() => {
    setUserData(initialUserData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUserData]);

  const formMethods = useForm<UserProfileEditFormSchema>({
    resolver: zodResolver(userProfileEditFormSchema),
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = formMethods;

  const LinkFields: {
    key: keyof UserProfileEditFormSchema['socialLinks'];
    label: string;
    description: string;
  }[] = [
    {
      key: 'bandcamp',
      label: 'Bandcamp',
      description: 'Link to your Bandcamp profile',
    },
    {
      key: 'discord',
      label: 'Discord',
      description: 'Link to your Discord profile',
    },
    {
      key: 'facebook',
      label: 'Facebook',
      description: 'Link to your Facebook page',
    },
    {
      key: 'github',
      label: 'Github',
      description: 'Link to your Github profile',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      description: 'Link to your Instagram profile',
    },
    {
      key: 'reddit',
      label: 'Reddit',
      description: 'Link to your Reddit profile',
    },
    {
      key: 'snapchat',
      label: 'Snapchat',
      description: 'Link to your Snapchat profile',
    },
    {
      key: 'soundcloud',
      label: 'Sound Cloud',
      description: 'Link to your Sound Cloud profile',
    },
    {
      key: 'spotify',
      label: 'Spotify',
      description: 'Link to your Spotify profile',
    },
    { key: 'steam', label: 'Steam', description: 'Link to your Steam profile' },
    {
      key: 'telegram',
      label: 'Telegram',
      description: 'Link to your Telegram profile',
    },
    {
      key: 'tiktok',
      label: 'Tiktok',
      description: 'Link to your Tiktok profile',
    },
    {
      key: 'threads',
      label: 'Threads',
      description: 'Link to your Threads profile',
    },
    {
      key: 'twitch',
      label: 'Twitch',
      description: 'Link to your Twitch profile',
    },
    { key: 'x', label: 'X', description: 'Link to your X profile' },
    {
      key: 'youtube',
      label: 'Youtube',
      description: 'Link to your Youtube channel',
    },
  ];

  return (
    <div className='max-w-screen-lg mx-auto'>
      <section>
        <h1>Edit Profile</h1>
        {/* Add your edit profile form here */}

        <form
          className={`flex flex-col gap-6`}
          onSubmit={formMethods.handleSubmit(() => {
            // Handle form submission
            console.log('Form submitted');
          })}
        >
          <div className='flex items-center justify-center gap-2 my-3 bg-cyan-800 border-cyan-400 text-cyan-300 border-2 rounded-lg px-3 py-2 text-sm'>
            <FontAwesomeIcon icon={faExclamationCircle} className='h-5' />
            <p>
              Please make sure to carefully review our{' '}
              <Link
                href='/guidelines'
                target='_blank'
                className='text-blue-400 hover:text-blue-300 hover:underline'
              >
                Community Guidelines
              </Link>
              <FontAwesomeIcon
                className='text-blue-400 ml-1 mr-1'
                size='xs'
                icon={faExternalLink}
              />{' '}
              before sharing your profile. We want to ensure a safe and positive
              environment for all users.
            </p>
          </div>
          {/* Description */}
          <div>
            <TextArea
              id='description'
              label='Description'
              tooltip={
                <>
                  <p>
                    This is a short description of yourself. It will be shown on
                    your profile page.
                  </p>
                </>
              }
              isLoading={isLoading}
              disabled={isLocked}
              errorMessage={errors.description?.message}
              {...register('description')}
            />
          </div>
          {/* Social Links */}
          <div>
            <h2 className='text-lg font-semibold'>Social Links</h2>
            <p className='text-sm text-gray-500'>
              Add links to your social media profiles. These links will be shown
              on your profile page.
            </p>
            <div className='flex-row gap-4 mt-2'>
              {LinkFields.map((link) => (
                <div key={link.key} className='flex-1 min-w-[200px]'>
                  <Input
                    id={link.key}
                    label={link.label}
                    tooltip={link.description}
                    isLoading={isLoading}
                    disabled={isLocked}
                    errorMessage={errors.socialLinks?.[link.key]?.message}
                    {...register(`socialLinks.${link.key}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
