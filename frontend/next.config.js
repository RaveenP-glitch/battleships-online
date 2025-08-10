/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  async rewrites() {
    // For Docker production, use the backend service name
    // For local development, use localhost
    const apiUrl = process.env.DOCKER_ENV === 'true' 
      ? 'http://backend:3001'
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
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