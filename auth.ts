import NextAuth from 'next-auth';
import Kakao from 'next-auth/providers/kakao';
import GoogleProvider from 'next-auth/providers/google';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [Kakao, GoogleProvider],
});
