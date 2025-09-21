import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ErrorBox = ({ message }: { message: string }) => {
  return (
    <div className='outline outline-2 text-center text-balance outline-red-500 bg-red-800 p-2 rounded-lg'>
      <FontAwesomeIcon icon={faWarning} className='mr-2 h-4' />
      {message}
    </div>
  );
};
