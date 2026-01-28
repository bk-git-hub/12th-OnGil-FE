// types/next-auth.d.ts

import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    userId: string;
    nickName: string;
    profileUrl: string | null;
    accessToken: string;
    refreshToken: string;
  }

  interface Session extends DefaultSession {
    user: {
      userId: string;
      nickName: string;
      profileImageUrl: string | null;
    } & DefaultSession['user'];
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId: string;
    nickname: string;
    profileImageUrl: string | null;
    accessToken: string;
    refreshToken: string;
  }
}
