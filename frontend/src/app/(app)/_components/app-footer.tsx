import Link from 'next/link'
import { Facebook, Instagram, Mail } from 'lucide-react'
import { APP_HOME } from './app-nav'
import { ViberaLogo } from './vibera-logo'

const NAVIGATE_LINKS = [
  { href: APP_HOME, label: 'Feed' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/mood-tracker', label: 'Mood Tracker' },
  { href: '/dashboard/profile', label: 'Profile' },
] as const

const LEARN_MORE_LINKS = [
  { href: '#', label: 'About Vibera' },
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms & Conditions' },
] as const

export function AppFooter() {
  return (
    <footer className="border-t border-[#E0E6D9] bg-[#F4F6F1]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <ViberaLogo imageClassName="h-8" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#7A6B3F]">
              Your companion for mindful mood tracking and emotional wellness.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-[#1F2E13]">Navigate</h3>
            <ul className="space-y-2.5">
              {NAVIGATE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#7A6B3F] transition-colors hover:text-[#1F2E13]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-[#1F2E13]">Learn More</h3>
            <ul className="space-y-2.5">
              {LEARN_MORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#7A6B3F] transition-colors hover:text-[#1F2E13]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-[#1F2E13]">Get in Touch</h3>
            <a
              href="mailto:support@vibera.com"
              className="text-sm text-[#7A6B3F] transition-colors hover:text-[#1F2E13]"
            >
              support@vibera.com
            </a>
            <p className="mt-3 text-sm text-[#7A6B3F]">
              We&apos;d love to hear from you! 👋
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="mailto:support@vibera.com"
                className="flex size-9 items-center justify-center rounded-full bg-white text-[#4B5A41] shadow-sm transition-colors hover:bg-[#F6C531]/20"
                aria-label="Email"
              >
                <Mail className="size-4" />
              </a>
              <a
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-white text-[#4B5A41] shadow-sm transition-colors hover:bg-[#F6C531]/20"
                aria-label="Facebook"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-white text-[#4B5A41] shadow-sm transition-colors hover:bg-[#F6C531]/20"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-[#E0E6D9] pt-6 text-center text-sm text-[#7A6B3F]">
          2026 Vibera. All rights reserved
        </p>
      </div>
    </footer>
  )
}
