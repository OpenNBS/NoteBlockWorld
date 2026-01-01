import GenericModal from '@web/modules/shared/components/client/GenericModal';

export default function DeleteConfirmDialog({
  isOpen,
  setIsOpen,
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
    <GenericModal title='Heads up!' isOpen={isOpen} setIsOpen={setIsOpen}>
      <p className='text-md text-white mb-2'>
        Would you like to delete ‘<span className='font-bold'>{songTitle}</span>
        ’?
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
    </GenericModal>
  );
}
