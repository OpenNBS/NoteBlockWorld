import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { getSortedPostsData } from '@web/lib/posts';
import type { PostType } from '@web/lib/posts';

export const metadata: Metadata = {
  title: 'Help Center'
};

async function HelpPage() {
  const allPostsData = getSortedPostsData('help', 'id');
  return <HelpPageComponent posts={allPostsData}></HelpPageComponent>;
}

const HelpPageComponent = ({ posts }: { posts: PostType[] }) => {
  return (
    <>
      <div className='relative w-0 h-0' aria-hidden={true}>
        <FontAwesomeIcon
          icon={faCircleQuestion}
          className='absolute text-[8rem] md:text-[12rem] text-zinc-400 opacity-15 rotate-[-15deg] translate-y-8'
        />
      </div>

      <h1 className='text-center text-5xl text-zinc-300 font-light uppercase mt-12 mb-6'>
        Help Center
      </h1>
      <h2 className='text-center text-xl font-light mb-12'>
        What can we help you with?
      </h2>

      <section className='flex flex-wrap justify-center w-full items-center gap-4'>
        {posts.map((post, i) => (
          <Link key={i} href={`/help/${post.id}`} className='w-full max-w-96'>
            <article
              key={i}
              className='relative hover:scale-105 transition-all duration-200'
            >
              <Image
                src={post.image || '/img/post.png'}
                width={480}
                height={360}
                alt={post.title}
                className='rounded-2xl aspect-[3/2] object-cover brightness-150 transition-all duration-300'
              />

              {/* Gradient over the image */}
              <div className='absolute top-0 left-0 w-full h-full hover:bg-white/20 transition-all duration-300 bg-gradient-to-b from-transparent to-black/80 rounded-2xl'>
                <h3 className='relative w-full h-full p-3 sm:p-6 flex justify-center items-end text-xl text-opacity-50'>
                  {post.shortTitle || post.title}
                </h3>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </>
  );
};

export default HelpPage;
