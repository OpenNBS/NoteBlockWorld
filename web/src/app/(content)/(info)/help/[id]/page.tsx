import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PostType, getPostData } from '@web/src/lib/posts';
import BackButton from '@web/src/modules/shared/components/client/BackButton';
import { CustomMarkdown } from '@web/src/modules/shared/components/CustomMarkdown';

type HelpPageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: HelpPageProps): Metadata {
  const id = params.id;
  const post = getPostData('help', id);

  const publicUrl = process.env.NEXT_PUBLIC_URL;

  return {
    title: post.title,
    authors: [{ name: post.author }],
    openGraph: {
      url: publicUrl + '/help/' + id,
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

const HelpPost = ({ params }: HelpPageProps) => {
  const { id } = params;
  let post: PostType;

  try {
    post = getPostData('help', id);
  } catch (error) {
    notFound();
  }

  return (
    <>
      <article className='max-w-screen-md mx-auto mb-36'>
        <BackButton className='text-zinc-500 hover:text-zinc-400 text-sm'>
          {'< Back to Help'}
        </BackButton>
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
          <div className='text-md text-zinc-400 leading-tight'>
            <p>
              by <span className='font-bold text-zinc-300'>{post.author}</span>
            </p>
          </div>
        </div>

        <CustomMarkdown MarkdownContent={post.content} />
        <p className='text-center italic text-zinc-400 mt-24'>
          Still need help?{' '}
          <Link href='/contact' className=' text-blue-400 hover:text-blue-300'>
            Reach out to us!
          </Link>{' '}
        </p>
      </article>
    </>
  );
};

export default HelpPost;
