/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  webpack: (config) => {
    config.externals = [...config.externals, { realm: 'realm' }]; // required to make realm
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
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
  output: 'standalone',
};

module.exports = nextConfig;
