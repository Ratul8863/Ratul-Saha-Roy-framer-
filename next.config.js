/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: true,
  experimental: {
    isrMemoryCacheSize: 0,
  },
  staticPageGenerationTimeout: 30,
};

module.exports = nextConfig;
