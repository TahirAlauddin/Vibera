import * as React from 'react'
import { Button as ShadcnButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CustomButtonProps = Omit<React.ComponentProps<typeof ShadcnButton>, 'variant' | 'size'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'disabled'
  size?: 'default' | 'sm' | 'lg'
}

const variantClassMap = {
  primary:
    'rounded-md bg-[var(--color-accent-primary)] text-black ' +
    'hover:bg-[var(--color-accent-primary-hover)] ' +
    'active:bg-[var(--color-accent-primary-active)]',

  secondary:
    'rounded-md bg-white border border-[#91B6A2] text-black ' +
    'hover:bg-[#91B6A2] hover:border-[#91B6A2] hover:text-black ' +
    'active:bg-[#D7E9B6] active:border-[#91B6A2] active:text-black',

  disabled:
    'rounded-md bg-[#E0E6D9] border border-[#E0E6D9] text-black cursor-not-allowed pointer-events-none opacity-100 ' +
    'hover:bg-[#E0E6D9] hover:border-[#E0E6D9] active:bg-[#E0E6D9] active:border-[#E0E6D9] disabled:opacity-100',

  ghost:
    'rounded-md bg-transparent text-[#000000] ' +
    'hover:bg-transparent hover:text-[#F6C531] ' +
    'active:bg-transparent active:text-[#000000]',
} as const

const sizeClassMap = {
  default: 'w-30 h-14 text-lg inline-flex items-center justify-center px-4 py-4 gap-1.5 rounded-md',
  sm: 'w-24 h-12 text-base inline-flex items-center justify-center px-5 py-4 gap-1.5 rounded-md',
  lg: 'w-36 h-16 text-2xl inline-flex items-center justify-center px-6 py-5 gap-2 rounded-md',
} as const

export function Button({
  variant = 'primary',
  size = 'default',
  className,
  ...rest
}: CustomButtonProps) {
  const shadcnVariant =
    variant === 'primary'
      ? 'default'
      : variant === 'secondary'
        ? 'outline'
        : variant === 'disabled'
          ? 'outline'
          : variant

  return (
    <ShadcnButton
      {...rest}
      variant={shadcnVariant}
      size={size}
      className={cn(sizeClassMap[size], variantClassMap[variant], className)}
    />
  )
}
