import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // 실제 이미지 호스팅 사이트
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // 더미 이미지 호스팅 사이트
      },
    ],
  },
};

export default nextConfig;
