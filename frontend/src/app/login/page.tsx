'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage({ onSwitch }: { onSwitch?: () => void }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center color-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col shadow-lg">
          <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-6">Log in</h2>
          <form action="" className="flex  flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="">Email</label>
              <input
                type="text"
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="border border-gray-300 rounded-lg px-4 py-2 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {/* buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
              <button className="mt-2 color-primary text-white w-full sm:w-50 py-2 cursor-pointer rounded-full font-medium hover:opacity-90 transition">
                Sign In
              </button>
              {onSwitch ? (
                <button
                  type="button"
                  onClick={onSwitch}
                  className="mt-2 bg-gray-200 text-gray-800 border border-gray-400 cursor-pointer py-2 w-full sm:w-50 rounded-full font-medium hover:bg-gray-300 transition"
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
        </div>
      </div>
    </div>
  )
}
