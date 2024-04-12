import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoadMoreButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className='flex justify-center col-span-full bg-zinc-800 rounded-lg py-6 md:py-4 sm:py-3 hover:bg-zinc-700 hover:scale-y-110 transition-all'
    >
      <FontAwesomeIcon icon={faChevronDown} />
    </button>
  );
};

export default LoadMoreButton;
