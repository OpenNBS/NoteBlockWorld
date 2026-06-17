import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Check if the current deployment is Production
  const isProd = process.env.NODE_ENV === 'production';

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
