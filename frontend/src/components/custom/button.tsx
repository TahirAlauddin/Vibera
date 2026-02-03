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
    'border border-[var(--color-accent-secondary-border)] text-black ' +
    'hover:bg-[var(--color-accent-secondary-hover)] ' +
    'active:bg-[var(--color-accent-secondary-active)] active:border-[var(--color-accent-secondary-border)] active:text-black',

  disabled:
    'rounded-md bg-[var(--color-accent-disabled-hover)] border border-[var(--color-accent-disabled-hover)] text-black cursor-not-allowed pointer-events-none opacity-100 ' +
    'hover:bg-[var(--color-accent-disabled-hover)] hover:border-[var(--color-accent-disabled-hover)] active:bg-[var(--color-accent-disabled-active)] active:border-[var(--color-accent-disabled-active)] disabled:opacity-100',

  ghost:
    'rounded-md bg-transparent text-[var(--color-accent-ghost-default)] ' +
    'hover:bg-transparent hover:text-[var(--color-accent-ghost-hover)] ' +
    'active:bg-transparent active:text-[var(--color-accent-ghost-active)]',
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
