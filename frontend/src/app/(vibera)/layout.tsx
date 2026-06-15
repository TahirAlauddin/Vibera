import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import { cn } from '@/lib/utils'
import { LandingNavbar } from './_components/landing-navbar'
import { LandingFooter } from './_components/landing-footer'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        plusJakarta.variable,
        playfair.variable,
        'flex min-h-screen flex-col bg-[#FFFBEB] text-[#423E28]'
      )}
      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
    >
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  )
}
