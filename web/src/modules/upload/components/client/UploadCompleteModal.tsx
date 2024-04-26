import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function UploadCompleteModal({ isOpen }: { isOpen: boolean }) {
  return (
    <Transition appear show={isOpen || true} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black opacity-50 backdrop-blur' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-2xl font-semibold leading-6 text-white'
                >
                  Upload complete!
                </Dialog.Title>
                <div className='h-2' />
                <p className='text-md text-white'>
                  You can now view or share your song with the link below:
                </p>

                {/*Copy button*/}
                <div className='flex justify-end items-center gap-4'>
                  <div className='h-10'>
                    <input
                      disabled={true}
                      className='box-border w-full h-full text-sm mt-4 p-2 outline outline-1 outline-zinc-600 bg-zinc-900 text-zinc-400 resize-none'
                      value={'https://www.noteblockstudio.com/song/1234'}
                    />
                  </div>
                  <button
                    type='button'
                    className='rounded-md h-full px-2 py-1 text-nowrap bg-zinc-700 text-white hover:bg-zinc-600'
                    onClick={() => {}}
                  >
                    Copy
                  </button>
                </div>

                <div className='h-6'></div>

                <div className='flex items-center justify-between gap-4'>
                  <button
                    type='button'
                    className='rounded-md px-4 py-2 text-nowrap bg-zinc-700 text-white hover:bg-zinc-600'
                    onClick={() => {}}
                  >
                    Upload again
                  </button>

                  <button
                    type='button'
                    className='rounded-md px-4 py-2 text-nowrap bg-zinc-700 text-white hover:bg-zinc-600'
                    onClick={() => {}}
                  >
                    Go to 'My songs'
                  </button>

                  <button
                    type='button'
                    className='rounded-md px-4 py-2 text-nowrap bg-blue-500 text-white hover:bg-blue-400'
                    onClick={() => {}}
                  >
                    View song
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
