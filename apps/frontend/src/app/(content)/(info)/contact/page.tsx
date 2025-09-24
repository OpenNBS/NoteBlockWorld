import type { Metadata } from 'next';

import BackButton from '@web/modules/shared/components/client/BackButton';


import Contact from './contact.mdx';

export const metadata: Metadata = {
  title: 'Contact',
};

const AboutPage = () => {
  return (
    <>
      <article className='max-w-screen-md mx-auto mb-36'>
        <BackButton className='text-zinc-500 hover:text-zinc-400 text-sm'>
          {'< Back'}
        </BackButton>
        <h1 className='text-4xl font-bold mt-16 mb-12'>Contact Us</h1>
        <Contact />
      </article>
    </>
  );
};

export default AboutPage;
