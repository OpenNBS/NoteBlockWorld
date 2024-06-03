import { GlobalError } from 'react-hook-form';

type ErrorBalloonProps = GlobalError & { isVisible: boolean };

export const ErrorBalloon = ({ message, isVisible }: ErrorBalloonProps) => {
  return (
    <>
      <div
        className={`text-red-600 text-sm absolute mt-1 ${
          message ? 'block' : 'hidden'
        }`}
      >
        {message}
      </div>
    </>
  );
};
