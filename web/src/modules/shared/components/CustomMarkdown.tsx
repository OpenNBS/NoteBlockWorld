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
      <article
        style={{
          padding: '8rem 1rem',
          maxWidth: '800px',
          minHeight: '100vh',
          margin: '0 auto',
          fontSize: '1.25rem',
        }}
      >
        <Markdown
          components={{
            p: ({ node, ...props }) => (
              <p {...props} style={{ lineHeight: 1.6 }} />
            ),
            h1: ({ node, ...props }) => (
              <h1 {...props} style={{ fontSize: '2rem', fontWeight: 'bold' }} />
            ),
            h2: ({ node, ...props }) => (
              <h2
                {...props}
                style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                {...props}
                style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
              />
            ),
            h4: ({ node, ...props }) => (
              <h4 {...props} style={{ fontSize: '1rem', fontWeight: 'bold' }} />
            ),
            h5: ({ node, ...props }) => (
              <h5
                {...props}
                style={{ fontSize: '0.875rem', fontWeight: 'bold' }}
              />
            ),
            h6: ({ node, ...props }) => (
              <h6
                {...props}
                style={{ fontSize: '0.75rem', fontWeight: 'bold' }}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} style={{ paddingLeft: '1rem' }} />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} style={{ paddingLeft: '1rem' }} />
            ),
            li: ({ node, ...props }) => (
              <li {...props} style={{ lineHeight: 1.6 }} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                style={{ borderLeft: '2px solid #333', paddingLeft: '1rem' }}
              />
            ),
            pre: ({ node, ...props }) => (
              <pre
                {...props}
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  padding: '1rem',
                  overflowX: 'auto',
                }}
              />
            ),
            code: ({ node, ...props }) => (
              <code
                {...props}
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  padding: '0.25rem',
                }}
              />
            ),
            a: ({ node, ...props }) => (
              <Link href={props.href as string} passHref>
                {props.children}
              </Link>
            ),
          }}
        >
          {MarkdownContent}
        </Markdown>
      </article>
      <Footer />
    </>
  );
};
