import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { JWT } from 'next-auth/jwt';
import { TokenRefreshReqDto, TokenRefreshResDto } from '@/types/domain/auth';
import { ApiResponse } from '@/types/common';

const TOKEN_REFRESH_BUFFER = 60 * 1000;
const REDACTED = '[REDACTED]';
const SENSITIVE_TOKEN_KEYS = new Set([
  'accessToken',
  'refreshToken',
  'access_token',
  'refresh_token',
  'id_token',
  'token',
  'email',
  'password',
  'username',
]);

function maskSensitiveUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.searchParams.has('code')) {
      parsedUrl.searchParams.set('code', REDACTED);
    }
    return parsedUrl.toString();
  } catch {
    return url.replace(/([?&]code=)[^&]*/i, `$1${REDACTED}`);
  }
}

function maskTokenField(value: unknown): string {
  if (typeof value !== 'string') return REDACTED;
  if (value.length <= 10) return REDACTED;
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function sanitizeLogData(value: unknown, seen = new WeakSet<object>): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeLogData(entry, seen));
  }

  if (value && typeof value === 'object') {
    if (seen.has(value as object)) {
      return '[Circular]';
    }
    seen.add(value as object);

    return Object.entries(value as Record<string, unknown>).reduce(
      (acc, [key, entryValue]) => {
        acc[key] = SENSITIVE_TOKEN_KEYS.has(key)
          ? maskTokenField(entryValue)
          : sanitizeLogData(entryValue, seen);
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  return value;
}

async function refreshAccessToken(token: JWT): Promise<JWT | null> {
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
      console.error('Failed to refresh access token - server may have restarted');
      // Return null to trigger sign out
      return null;
    }

    const { data }: ApiResponse<TokenRefreshResDto> = await response.json();

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
    };
  } catch (error) {
    console.error('Refresh token error - clearing session:', error);
    // Return null to clear the session and force re-login
    return null;
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

        const backendUrl = `${process.env.BACKEND_API_URL}/auth/oauth/${provider}?code=${encodeURIComponent(code)}`;
        const method = provider === 'google' ? 'GET' : 'POST';
        console.log(
          `[${provider}] OAuth Request:`,
          method,
          maskSensitiveUrl(backendUrl),
        );

        try {
          // Google uses GET, Kakao uses POST
          const res = await fetch(backendUrl, {
            method,
            ...(method === 'POST' && {
              headers: { 'Content-Type': 'application/json' },
            }),
          });

          console.log(`[${provider}] Response status:`, res.status);

          if (!res.ok) {
            const error = await res.json();
            console.error(
              `[${provider}] Backend error:`,
              sanitizeLogData(error),
            );
            throw new Error('Backend verification failed');
          }
          const { data } = await res.json();
          console.log(`[${provider}] Success data:`, sanitizeLogData(data));

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
          console.log('Credentials login success:', sanitizeLogData(data));

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
    async jwt({ token, user, trigger }) {
      if (user) {
        const expiresIn = user.expiresIn ?? 60 * 60;
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          userId: user.userId,
          nickName: user.nickName,
          profileUrl: user.profileUrl,
          accessTokenExpires: Date.now() + expiresIn * 1000,
        };
      }

      // Only attempt refresh if we have a refresh token (user is logged in)
      if (!token.refreshToken) {
        return token;
      }

      if (Date.now() < (token.accessTokenExpires ?? 0) - TOKEN_REFRESH_BUFFER) {
        return token;
      }

      // Try to refresh the token
      const refreshedToken = await refreshAccessToken(token);

      // If refresh failed (returns null), return null to clear session
      if (!refreshedToken) {
        return null;
      }

      return refreshedToken;
    },
    async session({ session, token }) {
      if (!token) {
        return session;
      }

      session.user.userId = token.userId as string;
      session.user.nickName = token.nickName as string;
      session.user.profileUrl = token.profileUrl;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/login', // Update this to your login page path
  },
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
});
