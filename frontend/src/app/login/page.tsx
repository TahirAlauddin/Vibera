'use client'

import React, { useState, FormEvent, useEffect } from 'react'
import { APP_HOME } from '@/app/dashboard/_components/dashboard-nav'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'

export default function LoginPage({ onSwitch }: { onSwitch?: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status, update } = useSession()

  // Redirect if already authenticated (using useEffect to avoid hydration issues)
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(APP_HOME)
    }
  }, [status, session, router])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Basic validation
    if (!username.trim()) {
      setError('Username is required')
      setIsLoading(false)
      return
    }

    if (!password) {
      setError('Password is required')
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        username: username.trim(),
        password: password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid username or password. Please try again.')
      } else if (result?.ok) {
        // Update session to ensure it's refreshed
        await update()
        // Use window.location for a hard redirect to ensure session is properly recognized
        window.location.href = APP_HOME
      }
    } catch (err) {
      // Handle error from signIn function
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center color-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col shadow-lg">
          <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-6">Log in</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="border border-gray-300 rounded-lg px-4 py-2 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {/* buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 color-primary text-white w-full sm:w-50 py-2 cursor-pointer rounded-full font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
              {onSwitch ? (
                <button
                  type="button"
                  onClick={onSwitch}
                  disabled={isLoading}
                  className="mt-2 bg-gray-200 text-gray-800 border border-gray-400 cursor-pointer py-2 w-full sm:w-50 rounded-full font-medium hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  No account? Sign Up
                </button>
              ) : (
                <Link
                  href="/signup"
                  className="mt-2 bg-gray-200 text-gray-800 border border-gray-400 cursor-pointer py-2 w-full sm:w-50 rounded-full font-medium hover:bg-gray-300 transition text-center"
                >
                  No account? Sign Up
                </Link>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => signIn('google', { callbackUrl: APP_HOME })}
            className="flex items-center justify-center gap-3 w-full py-2 border border-gray-300 rounded-full font-medium text-gray-700 bg-white hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.04 24.04 0 0 0 0 21.56l7.98-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
