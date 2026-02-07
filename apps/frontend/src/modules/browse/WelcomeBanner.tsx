import Image from 'next/image';
import Link from 'next/link';

export const WelcomeBanner = () => {
  return (
    <div className='flex flex-col md:flex-row mx-auto w-fit justify-between items-center text-center text-balance gap-1 py-4 px-2 sm:px-8 text-sm rounded-xl mb-10 bg-top backdrop-filter backdrop-blur-lg bg-linear-to-br from-15% from-green-700/50 via-cyan-800/50 to-85% to-blue-900/50 border-2 border-white/20'>
      <div
        className='absolute h-full w-full top-0 left-0 z-[-1] rounded-xl opacity-20 brightness-50 hue-rotate-90'
        style={{
          backgroundImage: "url('/background-tile-flat.png')",
          backgroundSize: '12em',
          backgroundAttachment: 'fixed',
        }}
      ></div>
      <Image
        src='/nbw-color.png'
        quality={75}
        alt='Note Block World logo'
        width={100}
        height={100}
      />
      <div className='flex-1 leading-tight max-w-(--breakpoint-md)'>
        <h1 className='text-lg font-bold mb-1 text-green-400'>
          Welcome to <strong className='text-teal-300'>Note Block World</strong>
          !
        </h1>
        <p className='mb-1 text-green-100'>
          We&apos;re the largest public community centered around Minecraft note
          blocks, where you can discover, share and listen to note block music
          from all around the world.
        </p>
        <p className='mb-2 text-green-100'>
          Start by browsing some of the songs uploaded by the community, or
          check out some of our useful resources below!
        </p>
        <span className='text-green-200/50'>
          <Link href='/help' className='text-blue-400 hover:text-blue-300'>
            Help Center
          </Link>
          {' • '}
          <Link
            href='https://github.com/OpenNBS/NoteBlockWorld'
            className='text-blue-400 hover:text-blue-300'
          >
            GitHub Repository
          </Link>
          {' • '}
          <Link
            href='https://discord.gg/note-block-world-608692895179997252'
            className='text-blue-400 hover:text-blue-300'
          >
            Discord Server
          </Link>
          {' • '}
          <Link
            href='https://github.com/orgs/OpenNBS/projects/4'
            className='text-blue-400 hover:text-blue-300'
          >
            Public Roadmap
          </Link>
          {' • '}
          <Link href='/blog' className='text-blue-400 hover:text-blue-300'>
            Update Logs
          </Link>
          {' • '}
          <Link
            href='https://github.com/OpenNBS/NoteBlockWorld/issues/new/choose'
            className='text-blue-400 hover:text-blue-300'
          >
            Feedback
          </Link>
          {' • '}
          <Link
            href='https://opencollective.com/opennbs/donate/profile'
            className='text-blue-400 hover:text-blue-300'
          >
            Donate
          </Link>
        </span>
      </div>
    </div>
  );
};
