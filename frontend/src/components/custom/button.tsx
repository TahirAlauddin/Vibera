import * as React from 'react'
import { Button as ShadcnButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CustomButtonProps = Omit<React.ComponentProps<typeof ShadcnButton>, 'variant' | 'size'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'disabled'
  size?: 'default' | 'sm' | 'lg'
}

const variantClassMap = {
  primary:
    'rounded-md bg-accent-primary text-black ' +
    'hover:bg-accent-primary-hover ' +
    'active:bg-accent-primary-active',

  secondary:
    'rounded-md bg-accent-secondary-default border border-accent-secondary-border text-black ' +
    'hover:bg-accent-secondary-hover ' +
    'active:bg-accent-secondary-active',

  disabled:
    'rounded-md bg-accent-disabled-hover border border-accent-disabled-hover text-black ' +
    'cursor-not-allowed pointer-events-none opacity-100 ' +
    'active:bg-accent-disabled-active',

  ghost:
    'rounded-md bg-transparent text-accent-ghost-default ' +
    'hover:text-accent-ghost-hover ' +
    'active:text-accent-ghost-active',
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
