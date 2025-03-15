import {
  IconDefinition,
  faBandcamp,
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faPatreon,
  faPinterest,
  faReddit,
  faSnapchat,
  faSoundcloud,
  faSpotify,
  faSteam,
  faTiktok,
  faTwitch,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const iconLookup: Record<string, IconDefinition> = {
  twitter: faXTwitter,
  youtube: faYoutube,
  github: faGithub,
  discord: faDiscord,
  bandcamp: faBandcamp,
  soundcloud: faSoundcloud,
  instagram: faInstagram,
  facebook: faFacebook,
  patreon: faPatreon,
  twitch: faTwitch,
  spotify: faSpotify,
  tiktok: faTiktok,
  linkedin: faLinkedin,
  snapchat: faSnapchat,
  pinterest: faPinterest,
  reddit: faReddit,
  steam: faSteam,
};

const UserSocialIcon = ({ icon, href }: { href: string; icon: string }) => (
  <Link
    href={href}
    className='text-zinc-500 hover:text-zinc-400 transition-colors duration-150'
  >
    <FontAwesomeIcon icon={iconLookup[icon]} className='text-xl' />
  </Link>
);

export default UserSocialIcon;
