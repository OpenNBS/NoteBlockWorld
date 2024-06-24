import Link from 'next/link';
import Markdown from 'react-markdown';

export const CustomMarkdown = ({
  MarkdownContent,
}: {
  MarkdownContent: string;
}) => {
  return (
    <>
      <article className='p-8 max-w-800 my-auto min-h-screen text-lg'>
        <Markdown
          components={{
            p,
            h1,
            h2,
            h3,
            h4,
            h5,
            h6,
            hr,
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
  return <p {...props} className='leading-6 my-2 font-light' />;
}

function h1({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h1'>;
}) {
  return (
    <h1
      {...props}
      className='text-3xl text-center uppercase font-light tracking-wider text-zinc-400 mb-24'
    />
  );
}

function h2({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h2'>;
}) {
  return <h2 {...props} className='text-2xl font-bold font mt-12 mb-3' />;
}

function h3({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h3'>;
}) {
  return <h3 {...props} className='text-xl font-bold my-8 mb-3' />;
}

function h4({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h4'>;
}) {
  return <h4 {...props} className='text-base font-bold my-3' />;
}

function h5({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h5'>;
}) {
  return <h5 {...props} className='text-sm font-bold my-3' />;
}

function h6({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'h6'>;
}) {
  return <h6 {...props} className='text-xs font-bold my-3' />;
}

function hr({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'hr'>;
}) {
  return <hr {...props} className='border-t-2 border-zinc-600 my-4' />;
}

function ul({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'ul'>;
}) {
  return <ul {...props} className='list-disc pl-8' />;
}

function ol({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'ol'>;
}) {
  return <ol {...props} className='list-decimal pl-8' />;
}

function li({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'li'>;
}) {
  return <li {...props} className='leading-6 pl-1' />;
}

function blockquote({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'blockquote'>;
}) {
  return (
    <blockquote
      {...props}
      className='border-l-4 border-zinc-600 text-zinc-400 pl-4 py-1'
    />
  );
}

function pre({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'pre'>;
}) {
  return (
    <pre
      {...props}
      className='bg-zinc-900 border border-zinc-700 [&>code]:border-none rounded-lg text-white text-sm p-2 overflow-x-auto'
    />
  );
}

function code({
  node,
  ...props
}: {
  node: React.ReactNode;
  props: React.ComponentPropsWithoutRef<'code'>;
}) {
  return (
    <code {...props} className='bg-zinc-900 text-white font-mono px-1 py-0.5' />
  );
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
    <Link
      {...props}
      href={href}
      className='underline text-blue-500 hover:text-blue-400'
    >
      {children}
    </Link>
  );
}
