import Link from 'next/link'
import { Facebook, Instagram } from 'lucide-react'
import { ViberaLogo } from '@/app/(app)/_components/vibera-logo'

export function LandingFooter() {
  return (
    <footer className="border-t border-[#E8E4D8] bg-[#FFFBEB]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <ViberaLogo href="/" imageClassName="h-7" />

        <p className="text-xs text-[#9CA3AF]">© 2026 Vibera</p>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-[#9CA3AF] transition-colors hover:text-[#6B8F5E]"
            aria-label="Twitter"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-[#9CA3AF] transition-colors hover:text-[#6B8F5E]"
            aria-label="Instagram"
          >
            <Instagram className="size-4" />
          </a>
          <a
            href="#"
            className="text-[#9CA3AF] transition-colors hover:text-[#6B8F5E]"
            aria-label="Facebook"
          >
            <Facebook className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
