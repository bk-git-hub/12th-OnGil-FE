import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // 로그인 페이지 경로를 지정, 내가 만든 로그인 페이지로 이동
  },
  providers: [],
  callbacks: {
    // 사용자가 접근 할 때마다 미들웨어에서 실행됨.
    authorized({ auth, request: { nextUrl } }) {
      //auth 객체에 user가 있으면 로그인 된 상태
      const isLoggedIn = !!auth?.user;

      //nextUrl의 경로가 특정경로로 시작하는지 확인
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
