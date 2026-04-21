import Link from 'next/link';
import type { JSX } from 'react';
import Markdown, { ExtraProps } from 'react-markdown';

/** Compact profile bio markdown: markdown `#` renders as &lt;h3&gt;, never as a page-level &lt;h1&gt;. */
export function ProfileBioMarkdown({
  MarkdownContent,
}: {
  MarkdownContent: string;
}) {
  return (
    <Markdown
      components={{
        p: bioP,
        h1: bioH1,
        h2: bioH2,
        h3: bioH3,
        h4: bioH4,
        h5: bioH5,
        h6: bioH6,
        hr: bioHr,
        ul: bioUl,
        ol: bioOl,
        li: bioLi,
        blockquote: bioBlockquote,
        pre: bioPre,
        code: bioCode,
        a: bioA,
        img: bioImg,
      }}
    >
      {MarkdownContent}
    </Markdown>
  );
}

const bioP = ({ node, ...props }: JSX.IntrinsicElements['p'] & ExtraProps) => (
  <p
    {...props}
    className='leading-relaxed text-sm text-zinc-300 my-2 first:mt-0 last:mb-0'
  />
);

/** Markdown `#` → always &lt;h3&gt; (subsection of the About block, never page title). */
const bioH1 = ({
  node,
  ...props
}: JSX.IntrinsicElements['h1'] & ExtraProps) => (
  <h3
    {...props}
    className='text-base font-semibold text-zinc-100 mt-4 mb-2 first:mt-0 scroll-mt-4'
  />
);

const bioH2 = ({
  node,
  ...props
}: JSX.IntrinsicElements['h2'] & ExtraProps) => (
  <h4
    {...props}
    className='text-sm font-semibold text-zinc-200 mt-3 mb-1.5 scroll-mt-4'
  />
);

const bioH3 = ({
  node,
  ...props
}: JSX.IntrinsicElements['h3'] & ExtraProps) => (
  <h5
    {...props}
    className='text-sm font-medium text-zinc-300 mt-3 mb-1 scroll-mt-4'
  />
);

const bioH4 = ({
  node,
  ...props
}: JSX.IntrinsicElements['h4'] & ExtraProps) => (
  <h6
    {...props}
    className='text-xs font-semibold uppercase tracking-wide text-zinc-400 mt-2 mb-1 scroll-mt-4'
  />
);

const bioH5 = ({
  node,
  ...props
}: JSX.IntrinsicElements['h5'] & ExtraProps) => (
  <p {...props} className='text-xs font-semibold text-zinc-400 mt-2 mb-1' />
);

const bioH6 = ({
  node,
  ...props
}: JSX.IntrinsicElements['h6'] & ExtraProps) => (
  <p {...props} className='text-xs font-medium text-zinc-500 mt-2 mb-1' />
);

const bioHr = ({
  node,
  ...props
}: JSX.IntrinsicElements['hr'] & ExtraProps) => (
  <hr {...props} className='border-zinc-700 my-4' />
);

const bioUl = ({
  node,
  ...props
}: JSX.IntrinsicElements['ul'] & ExtraProps) => (
  <ul
    {...props}
    className='list-disc pl-5 text-sm text-zinc-300 my-2 space-y-1'
  />
);

const bioOl = ({
  node,
  ...props
}: JSX.IntrinsicElements['ol'] & ExtraProps) => (
  <ol
    {...props}
    className='list-decimal pl-5 text-sm text-zinc-300 my-2 space-y-1'
  />
);

const bioLi = ({
  node,
  ...props
}: JSX.IntrinsicElements['li'] & ExtraProps) => (
  <li {...props} className='leading-relaxed pl-0.5' />
);

const bioBlockquote = ({
  node,
  ...props
}: JSX.IntrinsicElements['blockquote'] & ExtraProps) => (
  <blockquote
    {...props}
    className='border-l-2 border-zinc-600 bg-zinc-900/40 text-zinc-400 text-sm pl-3 py-1.5 my-3 rounded-r [&>p]:my-1'
  />
);

const bioPre = ({
  node,
  ...props
}: JSX.IntrinsicElements['pre'] & ExtraProps) => (
  <pre
    {...props}
    className='bg-zinc-950 border border-zinc-800 rounded-md text-zinc-200 text-xs p-2 my-2 overflow-x-auto [&>code]:bg-transparent [&>code]:p-0 [&>code]:outline-none'
  />
);

const bioCode = ({
  node,
  ...props
}: JSX.IntrinsicElements['code'] & ExtraProps) => (
  <code
    {...props}
    className='bg-zinc-900 text-emerald-400/90 rounded px-1 py-0.5 text-xs font-mono'
  />
);

const bioA = ({
  node,
  children,
  href = '',
  ...props
}: JSX.IntrinsicElements['a'] & ExtraProps) => {
  const { ref, ...rest } = props;
  return (
    <Link
      {...rest}
      href={href}
      className='text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline text-sm'
    >
      {children}
    </Link>
  );
};

const bioImg = ({
  node,
  alt,
  src = '',
  ...props
}: JSX.IntrinsicElements['img'] & ExtraProps) => (
  <img
    {...props}
    alt={alt}
    src={src}
    className='max-h-48 w-auto max-w-full rounded-md border border-zinc-700 my-3'
  />
);
