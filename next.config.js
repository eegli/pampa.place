/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts'],
  async redirects() {
    return [
      {
        source: '/game',
        destination: '/',
        permanent: true,
      },
    ];
  },
};
