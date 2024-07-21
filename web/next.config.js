/** @type {import('next').NextConfig} */

const nextConfig = {
  // See: https://github.com/Automattic/node-canvas/issues/867#issuecomment-1925284985
  webpack: (config) => {
    config.externals.push({
      '@napi-rs/canvas': 'commonjs @napi-rs/canvas',
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.THUMBNAIL_URL,
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
