/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  webpack: (config, { isServer }) => {
    // Handle externals for server-side builds
    if (isServer) {
      config.externals = [...config.externals, '@highlight-run/next'];
    }

    // Handle browser-only modules
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      '@highlight-run/next': isServer ? false : '@highlight-run/next',
    };

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
};

module.exports = nextConfig;
