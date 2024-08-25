import type { Metadata } from 'next';

import BackButton from '@web/src/modules/shared/components/client/BackButton';
import { NoteBlockWorldLogo } from '@web/src/modules/shared/components/NoteBlockWorldLogo';

import About from './about.mdx';

export const metadata: Metadata = {
  title: {
    template: '%s | Help',
    default: 'Note Block World',
  },
  openGraph: {
    title: 'Create, share and listen to note block music',
    description: 'Note Block World',
    siteName: 'Note Block World',
  },
};

const AboutPage = () => {
  return (
    <>
      <article className='max-w-screen-md mx-auto mb-36'>
        <NoteBlockWorldLogo
          size={112}
          orientation='horizontal'
          className='float-right'
        />
        <BackButton className='text-zinc-500 hover:text-zinc-400 text-sm'>
          {'< Back'}
        </BackButton>
        <h1 className='text-4xl font-bold mt-16 mb-12'>About Us</h1>
        <About />
      </article>
    </>
  );
};

export default AboutPage;
