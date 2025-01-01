'use client';

import { useState } from 'react';

import GenericModal from '@web/src/modules/shared/components/client/GenericModal';

/*
const getTwitterIntentUrl = (songId: string) => {
  const baseUrl = 'https://twitter.com/intent/tweet?`';

  const params = new URLSearchParams({
    text: `Check out my new song!`,
    url: `${process.env.NEXT_PUBLIC_URL}/song/${songId}`,
  });

  const url = `${baseUrl}${params.toString()}`;
  return url;
};
*/

export default function ShareModal({
  isOpen,
  setIsOpen,
  songId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  songId: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/song/${songId}`,
    );

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <GenericModal title='Share song' isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className='flex justify-end items-center gap-3 h-8'>
        {/* Link box */}
        <input
          className='box-border h-full w-full text-sm p-2 outline outline-1 outline-zinc-600 bg-zinc-900 text-zinc-400 resize-none'
          value={`${process.env.NEXT_PUBLIC_URL}/song/${songId}`}
          disabled
        />

        {/* Copy button */}
        <button
          type='button'
          disabled={isCopied}
          className='rounded-md h-full px-2 w-[4.25rem] text-nowrap bg-zinc-700 text-white enabled:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-default disabled:text-xs'
          onClick={handleCopy()}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </GenericModal>
  );
}
