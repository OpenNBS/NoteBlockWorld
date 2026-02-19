import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Externalize packages that use Node.js built-in modules for server components
  serverExternalPackages: ['@nbw/database', '@nbw/config'],
  // See: https://github.com/Automattic/node-canvas/issues/867#issuecomment-1925284985
  webpack: (config, { isServer }) => {
    config.externals.push({
      '@napi-rs/canvas': 'commonjs @napi-rs/canvas',
    });

    // Prevent @nbw/thumbnail from being bundled on the server
    // It uses HTMLCanvasElement which is not available in Node.js
    // Also externalize backend packages that use Node.js modules
    if (isServer) {
      config.externals.push('@nbw/thumbnail', '@nbw/database');
    }

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
      // localhost - allow all localhost variants
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
      },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
