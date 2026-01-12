import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

interface BackendUser {
  userId: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ----------------------------------------------------------------
    // 1. Social Login (Kakao / Google) - Wraps the "Code" exchange
    // ----------------------------------------------------------------
    Credentials({
      id: 'external-oauth',
      name: 'External OAuth',
      credentials: {
        provider: { label: 'Provider', type: 'text' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        // ... (Your existing logic for Social Login) ...
        const parsed = z
          .object({ provider: z.enum(['google', 'kakao']), code: z.string() })
          .safeParse(credentials);

        if (!parsed.success) return null;
        const { provider, code } = parsed.data;

        const backendUrl = `${process.env.BACKEND_API_URL}auth/oauth/${provider}`;

        try {
          const res = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          if (!res.ok) throw new Error('Backend verification failed');
          const { data } = await res.json();

          // Normalize to BackendUser shape
          return {
            userId: data.userId,
            name: data.user.name,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          } as BackendUser;
        } catch (error) {
          console.error('Social Auth Error:', error);
          return null;
        }
      },
    }),

    // ----------------------------------------------------------------
    // 2. ID / Password Login
    // ----------------------------------------------------------------
    Credentials({
      id: 'credentials-login', // UNIQUE ID for this strategy
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials);

        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Call your backend's standard login endpoint
        const backendUrl = `${process.env.BACKEND_API_URL}/auth/login`;

        try {
          const res = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) throw new Error('Invalid credentials'); // Or handle specific backend errors
          const { data } = await res.json();

          // CRITICAL: Must return the SAME shape (BackendUser) as the social login
          return {
            userId: data.userId,
            name: data.name,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          } as BackendUser;
        } catch (error) {
          console.error('Login Error:', error);
          return null;
        }
      },
    }),
  ],

  // ----------------------------------------------------------------
  // Callbacks (Shared by BOTH providers)
  // ----------------------------------------------------------------
  callbacks: {
    async jwt({ token, user }) {
      // This 'user' object comes from whichever 'authorize' function ran successfully
      if (user) {
        const u = user as BackendUser;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.userId = u.userId;
      }
      return token;
    },
    async session({ session, token }) {
      session.userId = token.userId as string;
      // @ts-expect-error - extending session type
      session.accessToken = token.accessToken;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
});
