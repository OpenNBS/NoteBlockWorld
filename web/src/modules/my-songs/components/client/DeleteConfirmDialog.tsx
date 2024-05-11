import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function DeleteConfirmDialog({
  isOpen,
  setIsOpen,
  songId,
  songTitle,
  onConfirm,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  songId: string;
  songTitle: string;
  onConfirm: () => void;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => setIsOpen(false)}
      >
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

        <div className='fixed inset-0 overflow-y-auto'>
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
                  Heads up!
                </Dialog.Title>

                <p className='text-md text-white mb-2'>
                  Would you like to delete ‘
                  <span className='font-bold'>{songTitle}</span>’?
                </p>
                <p>
                  This action is{' '}
                  <strong className='font-bold underline'>permanent</strong> and{' '}
                  <strong className='font-bold underline'>irreversible</strong>!
                </p>

                <div className='flex flex-row justify-center gap-4 pt-4'>
                  <button
                    type='button'
                    className='bg-zinc-700 hover:bg-zinc-600 px-3 py-2 rounded-lg'
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type='button'
                    className='bg-red-700 hover:bg-red-600 px-3 py-2 rounded-lg'
                    onClick={onConfirm}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
