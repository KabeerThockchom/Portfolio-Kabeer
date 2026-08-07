import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Linting runs in local dev / CI (npm run lint); don't let it block or slow
  // the Vercel production build. Type-checking still runs during the build.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
