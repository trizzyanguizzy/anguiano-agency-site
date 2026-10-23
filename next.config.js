const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // The meal planner grew into the family app at /family; keep old links and Home Screen icons working.
  async redirects() {
    return [
      { source: '/meals', destination: '/family/meals', permanent: false },
      { source: '/meals/:path*', destination: '/family/meals/:path*', permanent: false },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
