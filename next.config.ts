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
      {
        protocol: 'https',
        hostname: 'example.com', // TODO: 실제 API 이미지 호스트로 교체 필요
      },
      {
        protocol: 'https',
        hostname: 'ongil-bucket.s3.ap-northeast-2.amazonaws.com', // 광고 이미지 S3 버킷
      },
      {
        protocol: 'http',
        hostname: 'img1.kakaocdn.net', // 카카오 프로필 이미지 호스팅
      },
      {
        protocol: 'https',
        hostname: 'image.msscdn.net', // 무신사 상품 이미지 호스팅
      },
      {
        protocol: 'https',
        hostname: 'image.queenit.kr', // 카테고리 이미지 호스팅
      },
      {
        protocol: 'https',
        hostname: 'img.a-bly.com', // 카테고리 이미지 호스팅
      },
    ],
  },

  // next.js 공식문서 참조.
  async headers() {
    return [
      {
        // 모든 페이지에 적용되는 보안 헤더
        /* 
          1. X-Content-Type-Options: MIME 스니핑 방지
          2. X-Frame-Options: 클릭재킹 공격 방지
          3. Referrer-Policy: 리퍼러 정보 제어  
        */
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Service Worker 파일에 대한 특별 설정
        /* 
          1. Content-Type: 올바른 MIME 타입 설정, 서비스 워커가 자바스크립트로 인식되도록 함
          2. Cache-Control: 절대 캐싱하지 않도록 설정, 서비스 워커의 최신 버전이 즉시 반영되도록 함
          3. Content-Security-Policy: 스크립트 출처를 자기 자신으로 제한
        */
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
