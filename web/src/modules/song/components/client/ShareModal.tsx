'use client';

import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Fragment, useState } from 'react';

const getTwitterIntentUrl = (songId: string) => {
  const baseUrl = 'https://twitter.com/intent/tweet?`';

  const params = new URLSearchParams({
    text: `Check out my new song!`,
    url: `${process.env.NEXT_PUBLIC_URL}/song/${songId}`,
  });

  const url = `${baseUrl}${params.toString()}`;
  return url;
};

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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out-back duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/50' />
        </Transition.Child>

        <div className='fixed inset-0 w-screen overflow-y-auto backdrop-blur'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out-back duration-300'
              enterFrom='opacity-0 scale-50'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-90'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-2xl font-semibold leading-6 text-white mb-5'
                >
                  Share song
                </Dialog.Title>

                {/* X button */}
                <button
                  type='button'
                  aria-label='Close'
                  className='absolute top-3 right-4  w-4 h-4 text-white text-xl'
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>

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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
