import JSConfetti from 'js-confetti';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import GenericModal from '@web/src/modules/shared/components/client/GenericModal';

export default function UploadCompleteModal({
  isOpen,
  songId,
}: {
  isOpen: boolean;
  songId: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Confetti
    const canvas = document.getElementById('confetti') as HTMLCanvasElement;
    const confetti = new JSConfetti({ canvas });

    confetti.addConfetti({
      confettiRadius: 6,
      confettiNumber: 150,
      confettiColors: [
        '#f44336',
        '#9c27b0',
        '#3f51b5',
        '#03a9f4',
        '#009688',
        '#8bc34a',
        '#ffeb3b',
        '#ff9800',
      ],
    });
  }, []);

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
    <GenericModal title='Upload complete! 🎉' isOpen={isOpen}>
      <p className='text-md text-white mb-2'>
        You can now view or share your song with the link below:
      </p>

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

      <div className='flex items-center justify-between gap-4 mt-6'>
        <button
          type='button'
          className='rounded-md px-4 py-2 text-nowrap text-blue-500 hover:text-blue-300 hover:bg-blue-300/20'
          onClick={() => {
            window.location.reload();
          }}
        >
          Upload again
        </button>

        <Link
          href={`/my-songs`}
          className='rounded-md px-4 py-2 text-nowrap bg-blue-500/30 text-blue-300 hover:bg-blue-500/60 hover:text-white'
        >
          Go to my songs
        </Link>

        <Link
          href={`/song/${songId}`}
          className='rounded-md px-4 py-2 text-nowrap bg-blue-500 text-white hover:bg-blue-400'
        >
          View song
        </Link>
      </div>
    </GenericModal>
  );
}
