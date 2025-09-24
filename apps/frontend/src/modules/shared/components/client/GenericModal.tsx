'use client';

import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface GenericModalProps {
  isOpen    : boolean;
  setIsOpen?: (isOpen: boolean) => void;
  title     : string;
  children? : React.ReactNode | React.ReactNode[] | string;
}

const GenericModal = ({
  isOpen,
  setIsOpen,
  title,
  children
}: GenericModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={
          setIsOpen
            ? () => setIsOpen(false)
            : () => {
              return;
            }
        }
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

        <div className='fixed inset-0 w-screen overflow-y-auto'>
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
                  {title}
                </Dialog.Title>

                {/* X button */}
                {setIsOpen && (
                  <button
                    type='button'
                    aria-label='Close'
                    className='absolute top-3 right-4  w-4 h-4 text-white text-xl'
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                )}

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GenericModal;
