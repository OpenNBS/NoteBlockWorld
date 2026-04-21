'use client';

import { Check, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import type { PublicProfileDto } from '@nbw/validation';
import axiosInstance from '@web/lib/axios';
import { getTokenLocal } from '@web/lib/axios/token.utils';
import { Button } from '@web/modules/shared/components/ui/button';
import { Input } from '@web/modules/shared/components/ui/input';

type ProfilePublicNameEditorProps = {
  profile: PublicProfileDto;
  isOwner: boolean;
};

export function ProfilePublicNameEditor({
  profile,
  isOwner,
}: ProfilePublicNameEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [publicName, setPublicName] = useState(profile.publicName);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPublicName(profile.publicName);
  }, [profile.publicName]);

  const cancel = useCallback(() => {
    setPublicName(profile.publicName);
    setError(null);
    setIsEditing(false);
  }, [profile.publicName]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const token = getTokenLocal();
      await axiosInstance.patch(
        '/profile',
        { publicName: publicName.trim() },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );
      setIsEditing(false);
      router.refresh();
    } catch {
      setError('Could not save display name');
    } finally {
      setSaving(false);
    }
  }, [publicName, router]);

  if (!isOwner) {
    return (
      <h1 className='text-2xl font-bold text-zinc-100 truncate'>
        {profile.publicName}
      </h1>
    );
  }

  return (
    <div className='min-w-0'>
      <div className='flex items-center gap-2'>
        {isEditing ? (
          <Input
            type='text'
            value={publicName}
            onChange={(e) => setPublicName(e.target.value)}
            maxLength={100}
            className='flex-1 min-w-0 text-2xl font-bold text-zinc-100 h-auto py-1 border-zinc-600 bg-zinc-900'
            aria-label='Display name'
          />
        ) : (
          <h1 className='text-2xl font-bold text-zinc-100 truncate flex-1 min-w-0'>
            {profile.publicName}
          </h1>
        )}
        {!isEditing && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setIsEditing(true)}
            className='shrink-0 text-zinc-500 hover:bg-transparent hover:text-zinc-300'
            aria-label='Edit display name'
          >
            <Pencil className='h-5 w-5' />
          </Button>
        )}
        {isEditing && (
          <div className='flex gap-1 shrink-0'>
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
              disabled={saving || publicName.trim().length === 0}
              className='text-zinc-500 hover:bg-transparent hover:text-zinc-300 disabled:opacity-50'
              aria-label='Save'
            >
              <Check className='h-5 w-5' />
            </Button>
          </div>
        )}
      </div>
      {error && <p className='text-red-400 text-sm mt-1'>{error}</p>}
    </div>
  );
}
