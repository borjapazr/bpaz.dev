const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.']
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true
};

module.exports = withBundleAnalyzer(nextConfig);
