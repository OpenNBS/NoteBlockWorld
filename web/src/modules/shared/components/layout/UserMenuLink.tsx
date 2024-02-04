import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export const UserMenuLink = ({
  icon,
  href,
  label,
}: {
  icon: IconDefinition;
  href: string;
  label: string;
}) => (
  <div className='cursor-pointer hover:bg-gray-100 p-2 rounded-lg'>
    <Link href={href} passHref>
      <p className='flex items-center'>
        <FontAwesomeIcon icon={icon} />
        <span>{label}</span>
      </p>
    </Link>
  </div>
);
