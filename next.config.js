// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Allow serving HTML files from public
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      use: 'raw-loader',
    });
    return config;
  },
};

module.exports = nextConfig;
