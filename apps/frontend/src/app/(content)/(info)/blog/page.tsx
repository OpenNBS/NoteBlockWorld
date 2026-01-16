import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { getSortedPostsData } from '@web/lib/posts';
import type { PostType } from '@web/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
};

async function BlogPage() {
  const allPostsData = getSortedPostsData('blog', 'date');
  return <BlogPageComponent posts={allPostsData}></BlogPageComponent>;
}

const BlogPageComponent = ({ posts }: { posts: PostType[] }) => {
  return (
    <>
      <div className='relative w-0 h-0' aria-hidden={true}>
        <FontAwesomeIcon
          icon={faNewspaper}
          className='absolute text-[8rem] md:text-[12rem] text-zinc-400 opacity-15 rotate-[-15deg] translate-y-8'
        />
      </div>

      <h1 className='text-center text-5xl text-zinc-300 font-light uppercase mt-12 mb-6'>
        Blog
      </h1>
      <h2 className='text-center text-xl font-light mb-12'>
        {"See what we've been working on!"}
      </h2>

      <section className='grid grid-auto-fit-xl max-w-(--breakpoint-md) mx-auto justify-center w-full items-center gap-8'>
        {posts.map((post, i) => (
          <Link
            key={i}
            href={`/blog/${post.id}`}
            className='w-full h-full p-4 rounded-md bg-zinc-800/50 hover:bg-zinc-700/80 transition-all duration-200'
          >
            <article key={i} className='flex flex-col'>
              <Image
                src={post.image || '/img/post.png'}
                width={480}
                height={360}
                alt=''
                className='rounded-md aspect-video w-full object-cover transition-all duration-300 mb-2'
              />

              <h3 className='text-lg font-bold mb-2 leading-6 grow'>
                {post.title}
              </h3>
              <p className='text-zinc-300 tracking-wide text-sm mb-2'>
                {new Date(post.date)
                  .toLocaleDateString('en-UK')
                  .replace(/\//g, '.')}
              </p>
              <p className='self-end line-clamp-3 text-sm text-zinc-400 leading-[1.3]'>
                {post.content.slice(0, 200)}
              </p>
            </article>
          </Link>
        ))}
      </section>
    </>
  );
};

export default BlogPage;
