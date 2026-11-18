import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { renderToStaticMarkup } from 'react-dom/server';

import { CustomMarkdown } from './CustomMarkdown';

describe('CustomMarkdown images', () => {
  it('loads inline images lazily and decodes them asynchronously', () => {
    const html = renderToStaticMarkup(
      <CustomMarkdown MarkdownContent='![Example](/example.png)' />,
    );

    assert.match(html, /loading="lazy"/);
    assert.match(html, /decoding="async"/);
    assert.match(html, /alt="Example"/);
    assert.match(html, /src="\/example\.png"/);
  });

  it('preserves explicit loading and decoding for authored HTML images', () => {
    const html = renderToStaticMarkup(
      <CustomMarkdown MarkdownContent='<img src="/hero.png" loading="eager" decoding="sync" alt="" />' />,
    );

    assert.match(html, /loading="eager"/);
    assert.match(html, /decoding="sync"/);
  });
});
