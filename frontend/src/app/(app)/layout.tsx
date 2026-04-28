import { Plus_Jakarta_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { AppNavbar } from '@/app/(app)/_components/app-navbar'
import { AppFooter } from '@/app/(app)/_components/app-footer'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
})

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(plusJakarta.variable, 'flex min-h-screen flex-col bg-[#F5F3ED] text-[#1F2E13]')}
      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
    >
      <AppNavbar />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  )
}
