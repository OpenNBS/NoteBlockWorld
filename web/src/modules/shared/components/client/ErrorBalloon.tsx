import { GlobalError } from 'react-hook-form';

type ErrorBalloonProps = GlobalError;

export const ErrorBalloon = ({ message }: ErrorBalloonProps) => {
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
