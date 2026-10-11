'use client';

import { Check, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import removeMarkdown from 'remove-markdown';

import type { PublicProfileDto } from '@nbw/validation';
import axiosInstance from '@web/lib/axios';
import { getTokenLocal } from '@web/lib/axios/token.utils';
import { type SocialLinks } from '@web/modules/auth/types/User';
import { ProfileBioMarkdown } from '@web/modules/shared/components/ProfileBioMarkdown';
import { Button } from '@web/modules/shared/components/ui/button';
import { Input } from '@web/modules/shared/components/ui/input';
import { Label } from '@web/modules/shared/components/ui/label';
import { Textarea } from '@web/modules/shared/components/ui/textarea';

import { socialKeys, SOCIAL_LINK_ICONS } from './socialKeys';

type ProfileBioEditorProps = {
  profile: PublicProfileDto;
  isOwner: boolean;
};

/**
 * True when the bio has visible text after trimming and stripping markdown.
 * Uses `profile.description` for visitor visibility so client state cannot show an empty “About”.
 */
function hasDisplayableBio(description: string | undefined | null): boolean {
  const raw = description?.trim() ?? '';
  if (!raw) return false;
  if (raw.toLowerCase() === 'no description provided') return false;
  const plain = removeMarkdown(raw)
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > 0;
}

function cleanSocialLinks(links: SocialLinks): SocialLinks {
  const out: SocialLinks = {};
  for (const key of socialKeys) {
    const v = links[key]?.trim();
    if (v) out[key] = v;
  }
  return out;
}

const fieldInputClass =
  'border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500';

export function ProfileBioEditor({ profile, isOwner }: ProfileBioEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(profile.description);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(
    profile.socialLinks as SocialLinks,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDescription(profile.description);
    setSocialLinks(profile.socialLinks as SocialLinks);
  }, [profile]);

  const cancel = useCallback(() => {
    setDescription(profile.description);
    setSocialLinks(profile.socialLinks as SocialLinks);
    setError(null);
    setIsEditing(false);
  }, [profile.description, profile.socialLinks]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const token = getTokenLocal();
      await axiosInstance.patch(
        '/profile',
        {
          description,
          socialLinks: cleanSocialLinks(socialLinks),
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );
      setIsEditing(false);
      router.refresh();
    } catch {
      setError('Could not save profile');
    } finally {
      setSaving(false);
    }
  }, [description, socialLinks, router]);

  const showBioToPublic = hasDisplayableBio(description);

  if (!isOwner && !isEditing && !hasDisplayableBio(profile.description)) {
    return null;
  }

  return (
    <div className='mt-6 w-full text-left'>
      <div className='flex items-start justify-between gap-2'>
        <h2 className='text-lg font-semibold text-zinc-200'>About</h2>
        {isOwner && !isEditing && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setIsEditing(true)}
            className='text-zinc-500 hover:bg-transparent hover:text-zinc-300'
            aria-label='Edit profile'
          >
            <Pencil className='h-5 w-5' />
          </Button>
        )}
        {isOwner && isEditing && (
          <div className='flex gap-1'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={cancel}
              className='text-zinc-500 hover:bg-transparent hover:text-zinc-300'
              aria-label='Cancel'
            >
              <X className='h-5 w-5' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => void save()}
              disabled={saving}
              className='text-zinc-500 hover:bg-transparent hover:text-zinc-300 disabled:opacity-50'
              aria-label='Save'
            >
              <Check className='h-5 w-5' />
            </Button>
          </div>
        )}
      </div>

      {error && <p className='text-red-400 text-sm mt-2'>{error}</p>}

      {isEditing ? (
        <div className='mt-3 flex flex-col gap-4'>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={12}
            className={`font-mono text-sm min-h-48 ${fieldInputClass}`}
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {socialKeys.map((key) => {
              const Icon = SOCIAL_LINK_ICONS[key];
              const id = `profile-social-${key}`;
              return (
                <div key={key} className='flex flex-col gap-1 text-sm'>
                  <Label
                    htmlFor={id}
                    className='text-zinc-400 flex items-center gap-2 capitalize font-normal'
                  >
                    <Icon
                      className='w-4 h-4 shrink-0 text-zinc-500'
                      aria-hidden
                    />
                    {key}
                  </Label>
                  <Input
                    id={id}
                    type='url'
                    value={socialLinks[key] ?? ''}
                    onChange={(e) =>
                      setSocialLinks((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className={`h-8 px-2 py-1 text-sm ${fieldInputClass}`}
                    placeholder='https://'
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : showBioToPublic ? (
        <div className='mt-3 max-w-none'>
          <ProfileBioMarkdown MarkdownContent={description} />
        </div>
      ) : isOwner ? (
        <p className='mt-3 text-sm text-zinc-500'>
          No description yet — use the pencil to add a bio.
        </p>
      ) : null}
    </div>
  );
}
