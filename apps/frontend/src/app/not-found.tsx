import Image from 'next/image';
import Link from 'next/link';

const lines = [
  'You slipped on a glissando and fell.',
  'You tuned your note block past F♯5.',
  'You forgot the redstone and made a stack of chests.',
  'You went above the polyphony limit.',
  'Note limit for playing is 248.',
  'The sand of your snare fell.',
  'You attracted too many allays.',
  'You ran out of gold making a doorbell.',
  'You ran out of emeralds making an arcade.',
  'Your song went up to G5.',
  'The villagers mistook your didgeridoo for a raid.',
  'You blew a goat horn too strong.',
  'The note block world stopped spinning.',
  'You tried to tune a bed in the End.',
  'You tried to tune a bed in the Nether.',
  'Sounds like you hit a wrong note.',
  'Your note block had a manufacturing defect and makes no sound.',
  'The dragon growl was from a real dragon.',
  'The creeper hiss was from a real creeper.',
  "Note blocks don't absorb fall damage.",
  'That note block was a trigger for a TNT cannon.',
  'You hit a note block too hard and it fought back.',
  'That catchy tune was a fire alarm.',
  'You tried to play a note block with an axe.',
  'You had Jukeboxes/Note Blocks muted.',
  "Regular torches don't play note blocks.",
  'You tried to play a note block in Creative Mode.',
  'You spilled water over your song.',
  "Note blocks don't make good smelting fuel.",
  'You played a birthday song but it was last month.',
  'That anvil made you A♭ blob.',
  'You got hit with A♯ sword.',
];

export default function NotFound() {
  return (
    <>
      <div
        className="fixed w-full h-full bg-center bg-repeat grayscale brightness-50 opacity-30 before:content-[''] before:absolute before:w-full before:h-full before:bg-linear-to-b before:from-black/20 before:to-black/80"
        style={{
          backgroundImage: "url('/background-tile-flat.png')",
        }}
      ></div>

      <main className='w-full h-screen text-center *:z-2 p-2 bg-zinc-900 flex flex-col items-center justify-center gap-8'>
        {/* Background image */}

        <p className='font-light text-zinc-400 text-5xl'>Oops...</p>
        <div className='flex flex-col md:flex-row items-center justify-center py-12'>
          <Image
            src='/broken.png'
            alt=''
            width={400}
            height={400}
            quality={95}
            className='object-contain relative md:left-8 top-8 w-64 md:w-full z-2'
          />
          <h1 className='leading-none font-black text-[10rem] md:text-[18rem] z-1 text-zinc-600/30 relative bottom-8 md:right-12 md:bottom-16'>
            404
          </h1>
        </div>
        {/* Random note block error */}
        <p className='text-xl font-light text-zinc-300'>
          {lines[Math.floor(Math.random() * lines.length)]}
        </p>
        <Link
          href='/'
          className='text-sm text-blue-500 hover:text-blue-400 hover:underline'
        >
          Return to safety
        </Link>
      </main>
    </>
  );
}
