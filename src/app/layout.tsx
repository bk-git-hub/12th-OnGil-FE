import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegister from '@/components/sw-register';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// 1. 뷰포트 설정
export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 2. 메타데이터 설정
export const metadata: Metadata = {
  title: '온길 - 시니어 쇼핑몰',
  description: '시니어 친화적인 쇼핑몰 온길입니다.',

  // iOS 홈 화면 아이콘 설정
  appleWebApp: {
    title: '온길', // ios에서 short-name로 사용하는 옵션.
    capable: true, // 웹앱 모드 활성화
    statusBarStyle: 'black-translucent', // 상태바 투명/검정 등 설정
  },

  // 아이콘 연결
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png', // 아이폰은 이 이미지를 씀
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegister />
        {children}
        {modal}
      </body>
    </html>
  );
}
