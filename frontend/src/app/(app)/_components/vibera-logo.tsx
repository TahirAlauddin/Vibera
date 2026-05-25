import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { APP_HOME } from './app-nav'

const LOGO_SRC = '/assets/Logo.png'

type ViberaLogoProps = {
  className?: string
  imageClassName?: string
  href?: string
}

export function ViberaLogo({ className, imageClassName, href = APP_HOME }: ViberaLogoProps) {
  return (
    <Link href={href} className={cn('inline-flex shrink-0 items-center', className)}>
      <Image
        src={LOGO_SRC}
        alt="Vibera"
        width={120}
        height={48}
        className={cn('h-9 w-auto', imageClassName)}
        priority
      />
    </Link>
  )
}
