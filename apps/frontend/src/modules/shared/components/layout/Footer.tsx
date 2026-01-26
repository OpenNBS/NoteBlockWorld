import {
  IconDefinition,
  faDiscord,
  faGithub,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
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
    <footer className='flex items-center justify-center w-full h-fit min-h-12 py-4 z-10 border-t border-zinc-700 text-sm text-zinc-400'>
      <div className='flex-1 flex flex-col sm:flex-row gap-2 justify-around items-center max-w-(--breakpoint-xl) px-6 sm:px-10'>
        {/* Social links */}
        <div className='grow flex flex-row gap-2'>
          <FooterIcon icon={faTwitter} href='https://twitter.com/OpenNBS' />
          <FooterIcon icon={faYoutube} href='https://youtube.com/@OpenNBS' />
          <FooterIcon icon={faGithub} href='https://github.com/OpenNBS' />
          <FooterIcon
            icon={faDiscord}
            href='https://discord.gg/note-block-world-608692895179997252'
          />
          {/* <FooterIcon icon={faEarth} href='https://opennbs.org' /> */}
          {/* <FooterIcon icon={faEnvelope} href='mailto:opennbs@gmail.com' /> */}
          <FooterIcon
            icon={faHeart}
            href='https://opencollective.com/OpenNBS/donate/profile'
          />
        </div>

        <div className='shrink'>
          <p>
            © {new Date().getFullYear()}{' '}
            <Link href='https://opennbs.org/' className='hover:underline'>
              OpenNBS
            </Link>
          </p>
        </div>

        <div className='grow flex justify-end'>
          <Link href='/terms' className='hover:underline'>
            Terms
          </Link>
          <span className='mx-1'>|</span>
          <Link href='/privacy' className='hover:underline'>
            Privacy
          </Link>
          <span className='mx-1'>|</span>
          <Link href='/guidelines' className='hover:underline'>
            Guidelines
          </Link>
        </div>
      </div>
    </footer>
  );
}
