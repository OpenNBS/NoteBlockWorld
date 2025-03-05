import { faRocket, faSquareFull } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const EarlySupporterBadge = () => {
  return (
    <span
      className='inline-flex items-center rounded-full p-1 bg-indigo-700 text-white group transition-all duration-300 ease-in-out focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none'
      role='alert'
      tabIndex={0}
    >
      <FontAwesomeIcon
        className='text-indigo-700 text-xl bg-gradient-to-br from-green-200 via-teal-400 to-blue-600 scale-75 size-6 group-hover:scale-100 group-focus:scale-100 transition-all duration-300 ease-in-out'
        icon={faRocket}
        mask={faSquareFull}
      />

      <span className='whitespace-nowrap inline-block group-hover:max-w-screen-2xl group-focus:max-w-screen-2xl max-w-0 scale- group-hover:scale-100 overflow-hidden transition-all duration-300 ease-in-out group-hover:px-1.5 group-focus:px-1.5'>
        <h2 className='font-black tracking-tight text-md text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-400'>
          Early Supporter
        </h2>
      </span>
    </span>
  );
};
