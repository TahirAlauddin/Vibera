/**
 * Type definitions for NextAuth.js to extend default types
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username: string;
      emailVerified?: Date | null;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    username: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?: string;
    username?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
