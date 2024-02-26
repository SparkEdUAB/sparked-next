/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: "mongodb://example:testspassword@dbserver.example:5555/userdata?tls=true&connectionTimeout=5000"
  },
  webpack: (config) => {
    config.externals = [...config.externals, { realm: "realm" }]; // required to make realm
    return config;
  },
};

module.exports = nextConfig;
