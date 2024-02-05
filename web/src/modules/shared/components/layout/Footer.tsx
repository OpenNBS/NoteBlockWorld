import {
  IconDefinition,
  faDiscord,
  faGithub,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import {
  faEarth,
  faEnvelope,
  faGlobe,
  faHeart,
  faMusic,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const FooterIcon = ({ icon, href }: { href: string; icon: IconDefinition }) => (
  <Link
    href={href}
    className='text-zinc-500 hover:text-zinc-400 transition-colors duration-150'
  >
    <FontAwesomeIcon icon={icon} className='text-2xl' />
  </Link>
);

export function Footer() {
  return (
    <footer className='w-full h-14 flex flex-row justify-between items-center border-t border-zinc-700 p-2 z-10 text-sm text-zinc-400'>
      {/* Social links */}
      <div className='flex-grow flex flex-row gap-2'>
        <FooterIcon icon={faTwitter} href='https://twitter.com/OpenNBS' />
        <FooterIcon icon={faYoutube} href='https://youtube.com/@OpenNBS' />
        <FooterIcon icon={faGithub} href='https://github.com/OpenNBS' />
        <FooterIcon icon={faDiscord} href='https://discord.gg' />
        {/* <FooterIcon icon={faEarth} href='https://discord.gg' /> */}
        {/* <FooterIcon icon={faEnvelope} href='mailto:opennbs@gmail.com' /> */}
        {/* <FooterIcon icon={faHeart} href='https://opencollective.com/OpenNBS' /> */}
      </div>

      <div className=''>
        <p>
          © {new Date().getFullYear()}{' '}
          <Link href='https://opennbs.org/' className='hover:underline'>
            OpenNBS
          </Link>
        </p>
      </div>

      <div className='flex-grow flex justify-end'>
        <Link href='/terms' className='hover:underline'>
          Terms
        </Link>
        <span className='mx-1'>|</span>
        <Link href='/privacy' className='hover:underline'>
          Privacy
        </Link>
      </div>
    </footer>
  );
}
