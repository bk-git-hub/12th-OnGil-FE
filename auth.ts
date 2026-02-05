import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { JWT } from 'next-auth/jwt';
import { TokenRefreshReqDto, TokenRefreshResDto } from '@/types/domain/auth';
import { ApiResponse } from '@/types/common';

const TOKEN_REFRESH_BUFFER = 60 * 1000;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/token/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: token.refreshToken,
        } satisfies TokenRefreshReqDto),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const { data }: ApiResponse<TokenRefreshResDto> = await response.json();

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
    };
  } catch (error) {
    console.error('Refresh token error:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

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

        const backendUrl = `${process.env.BACKEND_API_URL}/auth/oauth/${provider}?code=${code}`;
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
            expiresIn: data.expires_in,
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
            expiresIn: data.expires_in,
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
        const expiresIn = user.expiresIn ?? 60 * 60;
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          userId: user.userId,
          nickName: user.nickName,
          profileImageUrl: user.profileUrl,
          accessTokenExpires: Date.now() + expiresIn * 1000,
        };
      }

      if (Date.now() < (token.accessTokenExpires ?? 0) - TOKEN_REFRESH_BUFFER) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.userId = token.userId as string;
      session.user.nickName = token.nickName as string;
      session.user.profileUrl = token.profileImageUrl;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
});
