import { MetadataRoute } from 'next';

import { isProductionAppEnv } from '@web/lib/appEnv';

export default function robots(): MetadataRoute.Robots {
  const isProd = isProductionAppEnv();

  if (isProd) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'], // Block search engines from sensitive paths
      },
      sitemap: 'https://noteblock.world',
    };
  }

  // Block ALL crawling on Preview, Staging, and Local environments
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
