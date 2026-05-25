'use client'
import { Menu, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAuthenticated = status === 'authenticated'
  const user = session?.user

  const handleLogout = async () => {
    await signOut({ redirect: false })
    setMenuOpen(false)
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="relative flex w-full h-16 items-center">
      {/* LEFT GREEN SECTION  */}
      <div className="flex items-center justify-between color-primary shadow-md px-2 rounded-r-[2.5rem] w-[145%] min-w-0 h-full">
        {/* Brand */}
        <h1 className="font-bold text-3xl sm:text-5xl text-white truncate ">VIBERA</h1>

        {/* Logo at rounded edge */}
        <Image
          src="/assets/Logo.png"
          alt="Vibera"
          width={52}
          height={52}
          className="rounded-full shrink-0"
        />
      </div>

      {/* RIGHT WHITE SECTION – 40% */}
      <div className="flex items-center gap-3 bg-white px-4 justify-end w-[40%] h-full">
        {/* Desktop Search – hide earlier to prevent overlap */}
        {isAuthenticated && (
          <form className="relative hidden md:flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="rounded-full color-bg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
              <Image src="/assets/searchh.png" alt="search" width={24} height={24} />
            </button>
          </form>
        )}

        {/* Auth-aware navigation */}
        {isAuthenticated ? (
          <>
            {/* User info - Desktop */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
              <User className="w-4 h-4" />
              <span className="truncate max-w-[100px]">
                {user?.username || user?.name || user?.email}
              </span>
            </div>

            {/* Mobile / Tablet Search Icon */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2">
              <Image src="/assets/searchh.png" alt="search" width={24} height={24} />
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 focus:outline-none cursor-pointer"
            >
              <Menu />
            </button>
          </>
        ) : (
          <>
            {/* Login/Signup links when not authenticated */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-gray-700 hover:text-primary transition px-3 py-1 rounded-full hover:bg-gray-100"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-sm color-primary text-white px-4 py-1 rounded-full hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 focus:outline-none cursor-pointer md:hidden"
            >
              <Menu />
            </button>
          </>
        )}
      </div>

      {/* MOBILE / TABLET SEARCH BAR */}
      {searchOpen && (
        <form className="absolute top-16 left-0 w-full bg-white px-4 py-3 shadow-md ">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
              <Image src="/assets/searchh.png" alt="search" width={21} height={21} />
            </button>
          </div>
        </form>
      )}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white p-4 flex flex-col gap-2 rounded-md shadow-md z-50 min-w-[150px]">
          {isAuthenticated ? (
            <>
              {user && (
                <div className="px-3 py-2 border-b border-gray-200 mb-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.username || user.name || user.email}
                  </p>
                  {user.email && user.email !== user.username && user.email !== user.name && (
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  )}
                </div>
              )}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                }}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Profile
              </Link>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                }}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Settings
              </Link>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                }}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Following
              </Link>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                }}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Followers
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition flex items-center gap-2 mt-2 border-t border-gray-200 pt-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-sm color-primary text-white rounded-full hover:opacity-90 transition text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
