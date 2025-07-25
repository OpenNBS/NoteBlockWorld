import type { MDXComponents } from 'mdx/types';

import {
  a,
  blockquote,
  code,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  li,
  ol,
  p,
  pre,
  ul,
} from '@web/src/modules/shared/components/CustomMarkdown';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
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
    ...components,
  };
}
