import Link from 'next/link';
import Markdown from 'react-markdown';

import { Footer } from './layout/Footer';
import { Header } from './layout/Header';

export const CustomMarkdown = ({
  MarkdownContent,
}: {
  MarkdownContent: string;
}) => {
  return (
    <>
      <Header />
      <article className='p-8 max-w-800 mx-auto min-h-screen text-lg'>
        <Markdown
          components={{
            p,
            h1,
            h2,
            h3,
            h4,
            h5,
            h6,
            ul,
            ol,
            li,
            blockquote,
            pre,
            code,
            a,
          }}
        >
          {MarkdownContent}
        </Markdown>
      </article>
      <Footer />
    </>
  );
};

function p({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'p'>;
}) {
  return <p {...props} className='leading-6' />;
}

function h1({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h1'>;
}) {
  return <p {...props} className='text-2xl font-bold' />;
}

function h2({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h2'>;
}) {
  return <p {...props} className='text-2xl font-bold' />;
}

function h3({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h3'>;
}) {
  return <p {...props} className='text-lg font-bold' />;
}

function h4({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h4'>;
}) {
  return <p {...props} className='text-base font-bold' />;
}

function h5({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h5'>;
}) {
  return <p {...props} className='text-sm font-bold' />;
}

function h6({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h6'>;
}) {
  return <p {...props} className='text-xs font-bold' />;
}

function ul({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'ul'>;
}) {
  return <p {...props} className='pl-4' />;
}

function ol({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'ol'>;
}) {
  return <p {...props} className='pl-4' />;
}

function li({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'li'>;
}) {
  return <p {...props} className='leading-6' />;
}

function blockquote({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'blockquote'>;
}) {
  return <p {...props} className='border-l-2 pl-4' />;
}

function pre({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'pre'>;
}) {
  return (
    <p {...props} className='bg-gray-900 text-white p-4 overflow-x-auto' />
  );
}

function code({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'code'>;
}) {
  return <p {...props} className='bg-gray-900 text-white p-1' />;
}

function a({
  node,
  children,
  href,
  ...props
}: {
  node: React.ReactNode;
  children: React.ReactNode;
  href: string;
  props: React.ComponentPropsWithoutRef<'a'>;
}) {
  return (
    <Link {...props} href={href} className=''>
      {children}
    </Link>
  );
}
