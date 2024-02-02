import { GlobalError } from 'react-hook-form';

type ErrorBallonProps = GlobalError & { isVisible: boolean };

export const ErrorBallon = ({ message, isVisible }: ErrorBallonProps) => {
  return (
    <>
      <div
        className={`bg-red-600 p-2 absolute rounded-md mt-2 ${
          isVisible ? 'block' : 'hidden'
        }`}
      >
        {message}
      </div>
      <div
        // spacing
        className='block h-8'
      />
    </>
  );
};
