/** @type {import('next').NextConfig} */

const nextConfig = {
  // See: https://github.com/Automattic/node-canvas/issues/867#issuecomment-1925284985
  webpack: (config) => {
    config.externals.push({ canvas: 'commonjs canvas' });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.THUMBNAIL_URL,
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
