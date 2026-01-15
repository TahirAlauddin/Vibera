/**
 * NextAuth.js v5 Configuration
 * Integrates with Django REST Framework backend using Credentials Provider
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'

// Get API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * User type from backend
 */
export interface User {
  id: number
  email: string
  username: string
  first_name?: string
  last_name?: string
  is_active: boolean
  date_joined: string
}

/**
 * JWT token response from backend
 */
interface TokenResponse {
  access: string
  refresh: string
}

/**
 * NextAuth configuration
 */
export const authConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // Call Django backend to authenticate
          const response = await fetch(`${API_BASE_URL}/api/auth/jwt/create/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const tokens: TokenResponse = await response.json()

          // Fetch user data
          const userResponse = await fetch(`${API_BASE_URL}/api/auth/users/me/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokens.access}`,
            },
          })

          if (!userResponse.ok) {
            return null
          }

          const user: User = await userResponse.json()

          // Return user object with tokens
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.username,
            username: user.username,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour (matches backend access token lifetime)
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.id = user.id
        token.email = user.email
        token.username = user.username
        token.name = user.name
      }

      // Check if access token is expired and refresh if needed
      if (token.accessToken && isTokenExpired(token.accessToken as string)) {
        if (token.refreshToken) {
          try {
            const newAccessToken = await refreshAccessToken(token.refreshToken as string)
            if (newAccessToken) {
              token.accessToken = newAccessToken
            } else {
              // Refresh failed, clear tokens
              token.accessToken = null
              token.refreshToken = null
            }
          } catch (error) {
            console.error('Token refresh error:', error)
            token.accessToken = null
            token.refreshToken = null
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          username: token.username as string,
          emailVerified: null,
        }
        session.accessToken = token.accessToken as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home after login
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Redirect to baseUrl if external
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
} satisfies NextAuthConfig

/**
 * Decode the payload and Check if a JWT token is expired
 * Works in both browser and Node.js environments
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return true
    }

    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)

    // Use Buffer in Node.js, atob in browser
    let decoded: any
    if (typeof window === 'undefined') {
      // Server-side: use Buffer
      decoded = JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'))
    } else {
      // Client-side: use atob
      decoded = JSON.parse(atob(padded))
    }

    if (!decoded.exp) {
      return false
    }

    const expirationTime = decoded.exp * 1000
    const currentTime = Date.now()

    return currentTime >= expirationTime
  } catch (error) {
    return true
  }
}

/**
 * Refresh the access token using refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/jwt/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      return null
    }

    const data: { access: string } = await response.json()
    return data.access
  } catch (error) {
    console.error('Refresh token error:', error)
    return null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
