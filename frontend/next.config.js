/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
  typescript: {
    // Skip type checking during builds for faster deployment
    // Remove this in production for proper type checking
    ignoreBuildErrors: false,
  },
  eslint: {
    // Skip ESLint during builds for faster deployment
    // Remove this in production for proper linting
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig; 