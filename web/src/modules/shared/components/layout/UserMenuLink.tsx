import {
  IconDefinition,
  faExternalLink,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const UserMenuSplitLine = () => (
  <hr className='w-full h-0.5 bg-zinc-600 border-0 my-1' />
);

const UserMenuLink = ({
  icon,
  href,
  label,
  external = false,
  textColor = 'text-white',
}: {
  icon: IconDefinition;
  href: string;
  label: string;
  external?: boolean;
  textColor?: string;
}) => (
  <button className='cursor-pointer px-2 py-1.5 hover:bg-zinc-700 transition-colors duration-150'>
    <Link href={href} passHref target={external ? '_blank' : undefined}>
      <div className='flex flex-row items-center gap-2'>
        <div className='h-8 w-8 flex items-center justify-center'>
          <FontAwesomeIcon icon={icon} size='lg' className={textColor} />
        </div>
        <p className={`flex-grow text-left ${textColor}`}>{label}</p>
        {external && (
          <div className='h-5 w-5 text-zinc-500 flex items-center'>
            <FontAwesomeIcon
              icon={faExternalLink}
              size='sm'
              className='justify-self-end'
            />
          </div>
        )}
      </div>
    </Link>
  </button>
);

export { UserMenuSplitLine, UserMenuLink };
