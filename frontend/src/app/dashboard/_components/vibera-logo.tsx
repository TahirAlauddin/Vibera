import Link from 'next/link'
import { cn } from '@/lib/utils'

type ViberaLogoProps = {
  className?: string
  showText?: boolean
  textClassName?: string
}

export function ViberaLogo({ className, showText = true, textClassName }: ViberaLogoProps) {
  return (
    <Link href="/dashboard" className={cn('inline-flex items-center gap-2', className)}>
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F6C531] text-lg leading-none"
        aria-hidden
      >
        🙂
      </span>
      {showText && (
        <span className={cn('text-xl font-bold tracking-tight text-[#1F2E13]', textClassName)}>
          Vibera
        </span>
      )}
    </Link>
  )
}
