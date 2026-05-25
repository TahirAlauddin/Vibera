import { ViberaLogo } from '@/app/(app)/_components/vibera-logo'
import Link from 'next/link'

export function LandingNavbar() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <ViberaLogo href="/" />
      <Link
        href="/login"
        className="text-sm font-medium text-[#9CA3AF] transition-colors hover:text-[#423E28]"
      >
        Sign in
      </Link>
    </header>
  )
}
