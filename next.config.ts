import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tecnovacenter.shop',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  }
};

export default nextConfig;
