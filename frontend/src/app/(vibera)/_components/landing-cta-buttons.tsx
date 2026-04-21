import Link from 'next/link'

export function LandingCtaButtons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:gap-4 ${className}`}>
      <Link
        href="/signup"
        className="inline-flex items-center justify-center rounded-full bg-[#F6C531] px-6 py-3 text-sm font-semibold text-[#423E28] transition-colors hover:bg-[#E0B42D]"
      >
        Get Started – It&apos;s Free
      </Link>
      <a
        href="#connect-share"
        className="inline-flex items-center justify-center rounded-full border border-[#D1D5DB] bg-white px-6 py-3 text-sm font-semibold text-[#423E28] transition-colors hover:bg-[#FAFAF8]"
      >
        Learn More
      </a>
    </div>
  )
}
