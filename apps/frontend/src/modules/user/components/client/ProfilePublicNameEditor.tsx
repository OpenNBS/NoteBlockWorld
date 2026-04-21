'use client';

import { Check, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import type { PublicProfileDto } from '@nbw/validation';
import axiosInstance from '@web/lib/axios';
import { getTokenLocal } from '@web/lib/axios/token.utils';

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
          <input
            type='text'
            value={publicName}
            onChange={(e) => setPublicName(e.target.value)}
            maxLength={100}
            className='flex-1 min-w-0 text-2xl font-bold text-zinc-100 bg-zinc-900 border border-zinc-600 rounded-lg px-2 py-1'
            aria-label='Display name'
          />
        ) : (
          <h1 className='text-2xl font-bold text-zinc-100 truncate flex-1 min-w-0'>
            {profile.publicName}
          </h1>
        )}
        {!isEditing && (
          <button
            type='button'
            onClick={() => setIsEditing(true)}
            className='text-zinc-500 hover:text-zinc-300 p-1 rounded shrink-0'
            aria-label='Edit display name'
          >
            <Pencil className='w-5 h-5' />
          </button>
        )}
        {isEditing && (
          <div className='flex gap-1 shrink-0'>
            <button
              type='button'
              onClick={cancel}
              className='text-zinc-500 hover:text-zinc-300 p-1 rounded'
              aria-label='Cancel'
            >
              <X className='w-5 h-5' />
            </button>
            <button
              type='button'
              onClick={() => void save()}
              disabled={saving || publicName.trim().length === 0}
              className='text-zinc-500 hover:text-zinc-300 p-1 rounded disabled:opacity-50'
              aria-label='Save'
            >
              <Check className='w-5 h-5' />
            </button>
          </div>
        )}
      </div>
      {error && <p className='text-red-400 text-sm mt-1'>{error}</p>}
    </div>
  );
}
