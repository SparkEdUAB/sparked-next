/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  turbopack: {
    resolveAlias: {
      // Exclude canvas module (needed for react-pdf)
      canvas: '',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sparked-next.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
