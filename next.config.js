/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  experimental: {
    // Keep sharp/libvips memory bounded on the 0.5 vCPU / 512MB container:
    // one libvips worker thread and no libvips operation cache (Next already
    // caches optimized images on disk). Output bytes are unchanged.
    imgOptConcurrency: 1,
    imgOptOperationCache: false,
  },
  turbopack: {
    root: __dirname,
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
