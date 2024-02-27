/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  webpack: (config) => {
    config.externals = [...config.externals, { realm: "realm" }]; // required to make realm
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
