import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PostType, getPostData } from '@web/src/lib/posts';
import { CustomMarkdown } from '@web/src/modules/shared/components/CustomMarkdown';

type BlogPageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: BlogPageProps): Metadata {
  const id = params.id;
  const post = getPostData('blog', id);

  const publicUrl = process.env.NEXT_PUBLIC_URL;

  return {
    title: post.title,
    authors: [{ name: post.author }],
    openGraph: {
      url: publicUrl + '/blog/' + id,
      title: post.title,
      siteName: 'Note Block World',
      images: [
        {
          url: publicUrl + post.image,
        },
      ],
    },
  };
}

const BlogPost = ({ params }: BlogPageProps) => {
  const { id } = params;
  let post: PostType;

  try {
    post = getPostData('blog', id);
  } catch (error) {
    notFound();
  }

  return (
    <>
      {post.image && (
        <Image
          src={post.image}
          alt=''
          className='w-full h-[30vh] md:h-[50vh] object-cover mb-8 mt-[-2.5rem] rounded-xl'
          width={1920}
          height={1080}
        />
      )}
      <article className='max-w-screen-md mx-auto mb-36'>
        <Link
          href='/help'
          className='text-zinc-500 hover:text-zinc-400 text-sm'
        >
          {'< Back to Blog'}
        </Link>
        <h1 className='text-4xl font-bold mt-16 mb-8'>{post.title}</h1>

        {/* Author */}
        <div className='flex flex-row gap-3 items-center mb-16'>
          {post.authorImage && (
            <Image
              src={`/img/authors/${post.authorImage}`}
              alt=''
              className='w-8 h-8 rounded-full'
              width={32}
              height={32}
            />
          )}
          <div className='text-sm text-zinc-400 leading-tight'>
            <p>
              by <span className='font-bold text-zinc-300'>{post.author}</span>
            </p>
            <p>
              {/* Add 12 hours to the date to display at noon UTC */}
              {new Date(
                new Date(post.date).getTime() + 12 * 60 * 60 * 1000,
              ).toLocaleDateString('en-UK', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <CustomMarkdown MarkdownContent={post.content} />
      </article>
    </>
  );
};

export default BlogPost;
