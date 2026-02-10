/**
 * NextAuth.js v5 Configuration
 * Integrates with Django REST Framework backend using Credentials Provider
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import type { BackendUser, TokenResponse } from '@/types/next-auth'

// Get API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Validate required environment variables
if (!API_BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL environment variable is required. Please set it in your .env file.'
  )
}

/**
 * Token refresh lock to prevent concurrent refresh attempts
 */
let refreshTokenPromise: Promise<string | null> | null = null

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
          throw new Error('Username and password are required')
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
            // Try to extract error details from response
            let errorMessage = 'Invalid username or password'
            try {
              const errorData = await response.json()
              if (typeof errorData.detail === 'string') {
                errorMessage = errorData.detail
              } else if (
                typeof errorData.non_field_errors === 'object' &&
                Array.isArray(errorData.non_field_errors)
              ) {
                errorMessage = errorData.non_field_errors[0] || errorMessage
              }
            } catch {
              // If response is not JSON, use default error message
            }
            throw new Error(errorMessage)
          }

          const tokens: TokenResponse = await response.json()

          // Validate tokens received
          if (!tokens.access || !tokens.refresh) {
            throw new Error('Invalid response from authentication server')
          }

          // Fetch user data
          const userResponse = await fetch(`${API_BASE_URL}/api/auth/users/me/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokens.access}`,
            },
          })

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user information')
          }

          const user: BackendUser = await userResponse.json()

          // Validate user data
          if (!user.id || !user.email || !user.username) {
            throw new Error('Invalid user data received from server')
          }

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
          // Re-throw error to provide better error messages to user
          if (error instanceof Error) {
            console.error('Auth error:', error.message)
            throw error
          }
          console.error('Auth error:', error)
          throw new Error('An unexpected error occurred during authentication')
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    // 7 days to match refresh token lifetime (access token will be refreshed automatically)
    maxAge: 60 * 60 * 24 * 7, // 7 days
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

      // Check if access token is expired or close to expiring (within 5 minutes)
      if (token.accessToken && token.refreshToken) {
        const accessToken = token.accessToken as string
        const shouldRefresh = isTokenExpired(accessToken) || isTokenExpiringSoon(accessToken, 5) // 5 minutes buffer

        if (shouldRefresh) {
          try {
            // Use refresh lock to prevent concurrent refresh attempts
            if (!refreshTokenPromise) {
              refreshTokenPromise = refreshAccessToken(token.refreshToken as string)
            }

            const newAccessToken = await refreshTokenPromise
            refreshTokenPromise = null // Clear the lock

            if (newAccessToken) {
              token.accessToken = newAccessToken
            } else {
              // Refresh failed, clear tokens
              token.accessToken = null
              token.refreshToken = null
            }
          } catch (error) {
            refreshTokenPromise = null // Clear the lock on error
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

    // If token doesn't have expiration claim, treat it as expired for security
    if (!decoded.exp) {
      return true
    }

    const expirationTime = decoded.exp * 1000
    const currentTime = Date.now()

    return currentTime >= expirationTime
  } catch (error) {
    return true
  }
}

/**
 * Check if token is expiring soon (within specified minutes)
 */
function isTokenExpiringSoon(token: string, minutesBuffer: number): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return true
    }

    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)

    let decoded: any
    if (typeof window === 'undefined') {
      decoded = JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'))
    } else {
      decoded = JSON.parse(atob(padded))
    }

    if (!decoded.exp) {
      return true
    }

    const expirationTime = decoded.exp * 1000
    const currentTime = Date.now()
    const bufferTime = minutesBuffer * 60 * 1000 // Convert minutes to milliseconds

    // Return true if token expires within the buffer time
    return expirationTime - currentTime <= bufferTime
  } catch (error) {
    return true
  }
}

/**
 * Refresh the access token using refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  if (!refreshToken) {
    return null
  }

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

    if (!data.access) {
      return null
    }

    return data.access
  } catch (error) {
    console.error('Refresh token error:', error)
    return null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
