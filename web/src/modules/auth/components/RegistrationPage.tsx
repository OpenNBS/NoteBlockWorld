import { RegistrationForm } from './client/RegistrationForm';
import { CopyrightFooter } from '../../shared/components/layout/CopyrightFooter';
import { NoteBlockWorldLogo } from '../../shared/components/NoteBlockWorldLogo';

export const RegistrationPage = () => {
  return (
    <main
      data-test='login-page'
      className='w-full h-screen p-6 text-center text-balance flex flex-col items-center justify-center'
    >
      <div className='flex flex-col sm:flex-row gap-8 sm:gap-12 bg-zinc-900/30 backdrop-blur-md w-fit max-w-2xl rounded-2xl p-10'>
        {/* Left half */}
        <NoteBlockWorldLogo glow={true} orientation='adaptive' size={128} />

        {/* Vertical divider (mobile) */}
        <div className='w-[1px] min-h-full hidden sm:block bg-zinc-600'></div>
        {/* Horizontal divider (desktop) */}
        <div className='h-[1px] min-w-full block sm:hidden bg-zinc-600'></div>

        {/* Right half */}
        <div className='flex flex-col justify-center items-center gap-5'>
          <RegistrationForm />
        </div>
      </div>
      <CopyrightFooter className='fixed bottom-4' />
    </main>
  );
};
