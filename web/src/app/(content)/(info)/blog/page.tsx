import Image from 'next/image';
import Link from 'next/link';

import { getSortedPostsData } from '@web/src/lib/posts';
import type { PostType } from '@web/src/lib/posts';

async function BlogPage() {
  const allPostsData = getSortedPostsData('blog', 'date');
  return <BlogPageComponent posts={allPostsData}></BlogPageComponent>;
}

const BlogPageComponent = ({ posts }: { posts: PostType[] }) => {
  return (
    <>
      <h1 className='text-center text-5xl text-zinc-300 font-light uppercase mt-12 mb-16'>
        Blog
      </h1>

      <section className='grid grid-auto-fit-xl max-w-screen-md mx-auto justify-center w-full items-center gap-8'>
        {posts.map((post, i) => (
          <Link
            key={i}
            href={`/blog/${post.id}`}
            className='w-full h-full p-4 rounded-md bg-zinc-800/50 hover:bg-zinc-700/80 transition-all duration-200'
          >
            <article key={i} className='flex flex-col'>
              <Image
                src={post.image || '/demo.png'}
                width={480}
                height={360}
                alt=''
                className='rounded-md aspect-[3/2] w-full object-cover transition-all duration-300 mb-2'
              />

              <h3 className='text-lg font-bold text-opacity-50 mb-2 leading-6 flex-grow'>
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
