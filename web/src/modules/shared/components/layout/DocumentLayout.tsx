import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CopyrightFooter } from './CopyrightFooter';
import BackButton from '../client/BackButton';
import { NoteBlockWorldLogo } from '../NoteBlockWorldLogo';

const DocumentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='sm:p-4 flex flex-col items-center justify-between'>
      <div className='md:px-10 lg:px-20 py-8 mx-auto sm:my-[8rem] max-w-screen-lg sm:rounded-3xl bg-zinc-950/50 backdrop-blur-[10px]'>
        <BackButton className='px-8 text-zinc-500 hover:text-zinc-400 text-sm'>
          {'< Back'}
        </BackButton>
        <NoteBlockWorldLogo
          glow={false}
          orientation={'horizontal'}
          size={150}
        />
        <article className='p-8 max-w-800 my-auto min-h-screen text-lg'>
          {children}
        </article>
        <div className='flex justify-center'>
          <BackButton className='text-zinc-400 hover:text-zinc-300 w-10 h-10 rounded-full border border-zinc-400 hover:border-zinc-300 p-1.5 my-8'>
            <FontAwesomeIcon icon={faArrowLeft} className='text-lg' />
          </BackButton>
        </div>
      </div>

      <CopyrightFooter className='mt-8 mb-2 sm:my-0' />
    </main>
  );
};

export default DocumentLayout;
