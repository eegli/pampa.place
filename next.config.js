const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts'],
  /** @param {import('webpack').Configuration} config */
  async redirects() {
    return [
      {
        source: '/game',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/maps/v1/:path*',
        headers: [
          {key: 'Access-Control-Allow-Origin', value: 'null'},
          {key: 'Access-Control-Allow-Methods', value: 'GET'},
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(config);
