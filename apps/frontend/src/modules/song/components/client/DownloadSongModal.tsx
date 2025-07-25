'use client';

import { SongViewDtoType } from '@nbw/database';
import { useState } from 'react';

import { DownloadPopupAdSlot } from '@web/modules/shared/components/client/ads/AdSlots';
import GenericModal from '@web/modules/shared/components/client/GenericModal';

export default function DownloadSongModal({
  isOpen,
  setIsOpen,
  song,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  song: SongViewDtoType;
}) {
  const [isCopied, setIsCopied] = useState(false);

  let licenseInfo;

  if (song.license == 'cc_by_sa') {
    licenseInfo = `"${song.title}" by ${song.uploader.username} is licensed under CC BY-SA 4.0\n(https://creativecommons.org/licenses/by-sa/4.0)\n${process.env.NEXT_PUBLIC_URL}/song/${song.publicId}`;
  } else {
    licenseInfo = `"${song.title}" by ${song.uploader.username}. All rights reserved.\n${process.env.NEXT_PUBLIC_URL}/song/${song.publicId}`;
  }

  const handleCopy = () => () => {
    navigator.clipboard.writeText(licenseInfo);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <GenericModal
      title='Your download will begin shortly!'
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <p className='text-zinc-400 text-sm mb-3'>
        If you plan to use this song in your own creations, provide attribution
        to the author by attaching the following text:
      </p>
      <div className='flex justify-end items-end gap-3 h-fit'>
        {/* Attribution box */}
        <textarea
          className='box-border text-balance h-24 w-full text-sm p-2 outline outline-1 outline-zinc-600 bg-zinc-900 text-zinc-400 resize-none'
          value={licenseInfo}
          disabled
        />

        {/* Copy button */}
        <button
          type='button'
          disabled={isCopied}
          className='rounded-md h-8 px-2 w-[4.25rem] text-nowrap bg-zinc-700 text-white enabled:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-default disabled:text-xs'
          onClick={handleCopy()}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <DownloadPopupAdSlot className='mb-0' />
    </GenericModal>
  );
}
