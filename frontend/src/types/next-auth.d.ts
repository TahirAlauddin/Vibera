/**
 * Type definitions for NextAuth.js to extend default types
 */

import 'next-auth'
import 'next-auth/jwt'

/**
 * User type from backend API response
 */
export interface BackendUser {
  id: number
  email: string
  username: string
  first_name?: string
  last_name?: string
  is_active: boolean
  date_joined: string
}

/**
 * JWT token response from backend API
 */
export interface TokenResponse {
  access: string
  refresh: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      username: string
      emailVerified?: Date | null
    }
    accessToken?: string
  }

  interface User {
    id: string
    email: string
    name: string
    username: string
    accessToken?: string
    refreshToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    email?: string
    username?: string
    accessToken?: string
    refreshToken?: string
  }
}
