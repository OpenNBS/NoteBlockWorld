import { Dialog, Transition } from '@headlessui/react';
import JSConfetti from 'js-confetti';
import Link from 'next/link';
import { Fragment, useEffect } from 'react';

export default function UploadCompleteModal({
  isOpen,
  songId,
}: {
  isOpen: boolean;
  songId: string;
}) {
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

  return (
    <Transition appear show={isOpen || true} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black opacity-50' />
        </Transition.Child>

        <canvas id='confetti' className='fixed inset-0' />

        <div className='fixed inset-0 overflow-y-auto backdrop-blur'>
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
                  Upload complete!
                </Dialog.Title>

                <p className='text-md text-white mb-2'>
                  You can now view or share your song with the link below:
                </p>

                <div className='flex justify-end items-center gap-3 h-8'>
                  {/* Link box */}
                  <input
                    className='box-border h-full w-full text-sm p-2 outline outline-1 outline-zinc-600 bg-zinc-900 text-zinc-400 resize-none'
                    value={`https://noteblock.world/song/${songId}`}
                    disabled
                  />

                  {/* Copy button */}
                  <button
                    type='button'
                    className='rounded-md h-full px-2 text-nowrap bg-zinc-700 text-white hover:bg-zinc-600'
                    onClick={() => {}}
                  >
                    Copy
                  </button>
                </div>

                <div className='flex items-center justify-between gap-4 mt-6'>
                  <Link href='/upload'>
                    <button
                      type='button'
                      className='rounded-md px-4 py-2 text-nowrap text-blue-500 hover:text-blue-300 hover:bg-blue-300/20'
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Upload again
                    </button>
                  </Link>

                  <Link href={`/my-songs`}>
                    <button
                      type='button'
                      className='rounded-md px-4 py-2 text-nowrap bg-blue-500/30 text-blue-300 hover:bg-blue-500/60 hover:text-white'
                      onClick={() => {}}
                    >
                      {'Go to my songs'}
                    </button>
                  </Link>

                  <Link href={`/song/${songId}`}>
                    <button
                      type='button'
                      className='rounded-md px-4 py-2 text-nowrap bg-blue-500 text-white hover:bg-blue-400'
                      onClick={() => {}}
                    >
                      View song
                    </button>
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
