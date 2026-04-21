import Link from 'next/link'

export function LandingNavbar() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-2">
        <span
          className="flex size-9 items-center justify-center rounded-full bg-[#91B6A2] text-lg leading-none text-white"
          aria-hidden
        >
          🙂
        </span>
        <span className="text-xl font-semibold text-[#6B8F5E]">Vibera</span>
      </Link>
      <Link
        href="/login"
        className="text-sm font-medium text-[#9CA3AF] transition-colors hover:text-[#423E28]"
      >
        Sign in
      </Link>
    </header>
  )
}
