import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const UserMenuSplitLine = () => (
  <hr className='w-full h-0.5 bg-zinc-600 border-0 my-2' />
);

const UserMenuLink = ({
  icon,
  href,
  label,
}: {
  icon: IconDefinition;
  href: string;
  label: string;
}) => (
  <div className='cursor-pointer px-2 py-1.5 hover:bg-zinc-700 transition-colors duration-150'>
    <Link href={href} passHref>
      <div className='flex flex-row items-center gap-2'>
        <div className='h-8 w-8 flex items-center justify-center'>
          <FontAwesomeIcon icon={icon} size='lg' />
        </div>
        <p>{label}</p>
      </div>
    </Link>
  </div>
);

export { UserMenuSplitLine, UserMenuLink };
