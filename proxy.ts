import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

const protectedPaths = ['/dashboard', '/me', '/reviews'];

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isProtectedRoute = protectedPaths.some(
    (path) =>
      req.nextUrl.pathname === path ||
      req.nextUrl.pathname.startsWith(`${path}/`),
  );

  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const proxyConfig = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
