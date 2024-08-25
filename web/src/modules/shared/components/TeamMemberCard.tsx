import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';

export const TeamMemberCard = ({
  name,
  github,
  img,
  children,
}: {
  name: string;
  github: string;
  img: string;
  children: string;
}) => {
  return (
    <div className='flex flex-row gap-8 items-center'>
      <picture className='w-full max-w-fit'>
        <Image
          src={`/img/authors/${img}`}
          width={96}
          height={96}
          className='rounded-full w-24 h-24'
          quality={100}
          alt={''}
        />
      </picture>
      <div className=''>
        <h3 className='text-zinc-100 text-xl font-bold mb-4 inline-block'>
          {name}
        </h3>
        <Link href={`https://github.com/${github}`} passHref target='_blank'>
          <FontAwesomeIcon
            icon={faGithub}
            size='lg'
            className='text-zinc-500 mx-3 inline hover:text-zinc-400'
          />
        </Link>
        <p className='text-sm text-zinc-300'>{children}</p>
      </div>
    </div>
  );
};

export const Team = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='flex flex-col gap-8 mt-10 mx-8 mb-16'>
      {children}
    </section>
  );
};
