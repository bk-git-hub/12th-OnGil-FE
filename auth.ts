import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'external-oauth',
      name: 'External OAuth',
      credentials: {
        provider: { label: 'Provider', type: 'text' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ provider: z.enum(['google', 'kakao']), code: z.string() })
          .safeParse(credentials);

        if (!parsed.success) return null;
        const { provider, code } = parsed.data;

        const backendUrl = `${process.env.BACKEND_API_URL}auth/oauth/${provider}?code=${code}`;
        console.log(backendUrl);
        try {
          const res = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!res.ok) {
            const error = await res.json();
            console.log(error);
            throw new Error('Backend verification failed');
          }
          const { data } = await res.json();
          console.log(data);

          return {
            userId: data.userId,
            nickName: data.nickName,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            profileUrl: data.profileUrl || null,
          };
        } catch (error) {
          console.error('Social Auth Error:', error);
          return null;
        }
      },
    }),

    Credentials({
      id: 'credentials-login',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().min(1), password: z.string().min(1) })
          .safeParse(credentials);

        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const backendUrl = `${process.env.BACKEND_API_URL}/auth/login`;

        try {
          const res = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) throw new Error('Invalid credentials');
          const { data } = await res.json();
          console.log(data);

          return {
            userId: data.userId,
            nickName: data.nickName,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            profileUrl: data.profileUrl,
          };
        } catch (error) {
          console.error('Login Error:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.userId = u.userId;
        token.nickName = u.nickName;
        token.profileImageUrl = u.profileUrl;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.userId = token.userId as string;
      session.user.nickName = token.nickName as string;
      session.user.profileUrl = token.profileImageUrl;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
});
