import Link from 'next/link';
import type { JSX } from 'react';
import Markdown, { ExtraProps } from 'react-markdown';

export const CustomMarkdown = ({
  MarkdownContent,
}: {
  MarkdownContent: string;
}) => {
  return (
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
        img,
      }}
    >
      {MarkdownContent}
    </Markdown>
  );
};

const p = ({ node, ...props }: JSX.IntrinsicElements['p'] & ExtraProps) => {
  return <p {...props} className='leading-relaxed text-base my-4' />;
};

const h1 = ({ node, ...props }: JSX.IntrinsicElements['h1'] & ExtraProps) => {
  return <h1 {...props} className='text-4xl font-black my-12 text-center' />;
};

const h2 = ({ node, ...props }: JSX.IntrinsicElements['h2'] & ExtraProps) => {
  return <h2 {...props} className='text-3xl font-black mt-12 mb-6' />;
};

const h3 = ({ node, ...props }: JSX.IntrinsicElements['h3'] & ExtraProps) => {
  return <h3 {...props} className='text-2xl font-bold mt-10 mb-5' />;
};

const h4 = ({ node, ...props }: JSX.IntrinsicElements['h4'] & ExtraProps) => {
  return <h4 {...props} className='text-base font-black mt-8 mb-3' />;
};

const h5 = ({ node, ...props }: JSX.IntrinsicElements['h5'] & ExtraProps) => {
  return <h5 {...props} className='text-sm font-bold my-3' />;
};

const h6 = ({ node, ...props }: JSX.IntrinsicElements['h6'] & ExtraProps) => {
  return <h6 {...props} className='text-xs font-bold my-3' />;
};

const hr = ({ node, ...props }: JSX.IntrinsicElements['hr'] & ExtraProps) => {
  return <hr {...props} className='border-t-2 border-zinc-600 my-12' />;
};

const ul = ({ node, ...props }: JSX.IntrinsicElements['ul'] & ExtraProps) => {
  return <ul {...props} className='list-disc pl-8' />;
};

const ol = ({ node, ...props }: JSX.IntrinsicElements['ol'] & ExtraProps) => {
  return <ol {...props} className='list-decimal pl-8' />;
};

const li = ({ node, ...props }: JSX.IntrinsicElements['li'] & ExtraProps) => {
  return <li {...props} className='text-base leading-relaxed pl-1' />;
};

const blockquote = ({
  node,
  ...props
}: JSX.IntrinsicElements['blockquote'] & ExtraProps) => {
  return (
    <blockquote
      {...props}
      className='border-l-4 border-zinc-600 bg-zinc-800/50 rounded-md [&>p]:text-zinc-400 pl-4 [&>p]:py-2 my-6'
    />
  );
};

const pre = ({ node, ...props }: JSX.IntrinsicElements['pre'] & ExtraProps) => {
  return (
    <pre
      {...props}
      className='bg-zinc-900 border border-zinc-700 [&>code]:border-none rounded-lg text-white text-sm p-2 overflow-x-auto'
    />
  );
};

const code = ({
  node,
  ...props
}: JSX.IntrinsicElements['code'] & ExtraProps) => {
  return (
    <code
      {...props}
      className='bg-zinc-950/50 text-green-400 rounded-md outline-1 outline-zinc-600 text-sm font-mono px-1 py-0.5 mx-0.5'
    />
  );
};

const a = ({
  node,
  children,
  href = '',
  ...props
}: JSX.IntrinsicElements['a'] & ExtraProps) => {
  const { ref, ...rest } = props;
  return (
    <Link {...rest} href={href} className='text-blue-400 hover:text-blue-300'>
      {children}
    </Link>
  );
};

const img = ({
  node,
  alt,
  src = '',
  ...props
}: JSX.IntrinsicElements['img'] & ExtraProps) => {
  return (
    <img {...props} alt={alt} src={src} className='my-8 mx-auto rounded-lg' />
  );
};

export {
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
  img,
};
