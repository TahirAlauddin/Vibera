import { Plus_Jakarta_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
})

export default function UIGuideLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn(plusJakarta.variable, 'font-sans')} style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>{children}</div>
}
