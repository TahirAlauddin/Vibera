'use client'
import React, { useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'

// Get API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export default function SignUpPage({ onSwitch }: { onSwitch?: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRetype, setPasswordRetype] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Redirect if already authenticated (using useEffect to avoid hydration issues)
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/')
    }
  }, [status, session, router])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Basic validation
    if (!email.trim()) {
      setError('Email is required')
      setIsLoading(false)
      return
    }

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

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    if (password !== passwordRetype) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      // Call Django backend to create user account
      const response = await fetch(`${API_BASE_URL}/api/auth/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          username: username.trim(),
          password,
          re_password: passwordRetype,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Extract error messages from backend response
        const errorMessages: string[] = []
        for (const [key, value] of Object.entries(errorData)) {
          if (Array.isArray(value)) {
            errorMessages.push(...value)
          } else if (typeof value === 'string') {
            errorMessages.push(value)
          }
        }
        
        const errorMessage = errorMessages.length > 0 
          ? errorMessages.join('. ')
          : 'Signup failed. Please check your information.'
        throw new Error(errorMessage)
      }

      // After successful signup, automatically sign in
      const result = await signIn('credentials', {
        username: username.trim(),
        password: password,
        redirect: false,
      })

      if (result?.error) {
        setError('Account created successfully, but automatic login failed. Please login manually.')
      } else if (result?.ok) {
        // Redirect to home page on success
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      // Handle error from signup function
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
          <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
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
                  minLength={8}
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
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={passwordRetype}
                  onChange={(e) => setPasswordRetype(e.target.value)}
                  disabled={isLoading}
                  className="border border-gray-300 rounded-lg px-4 py-2 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 cursor-pointer color-primary text-white w-full sm:w-50 py-2 rounded-full font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
              {onSwitch ? (
                <button
                  type="button"
                  onClick={onSwitch}
                  disabled={isLoading}
                  className="mt-2 bg-gray-200 text-gray-800 border border-gray-400 cursor-pointer py-2 w-full sm:w-50 rounded-full font-medium hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign In
                </button>
              ) : (
                <Link
                  href="/login"
                  className="mt-2 bg-gray-200 text-gray-800 border border-gray-400 cursor-pointer py-2 w-full sm:w-50 rounded-full font-medium hover:bg-gray-300 transition text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
