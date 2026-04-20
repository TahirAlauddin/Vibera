'use client'

import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const sizeStyles = {
  sm: 'h-8 px-3 text-xs gap-1',
  md: 'h-10 px-4 text-sm gap-1.5',
  lg: 'h-12 px-6 text-base gap-2',
} as const

const normalInteractive =
  'bg-[#F6C531] text-white border-[#F6C531] ' +
  'hover:bg-[#757575] hover:border-[#757575] ' +
  'active:bg-[#B2C9AB] active:border-[#B2C9AB]'

const outlineInteractive =
  'bg-transparent text-[#F6C531] border-[#F6C531] ' +
  'hover:text-[#757575] hover:border-[#757575] ' +
  'active:text-[#B2C9AB] active:border-[#B2C9AB]'

const disabledStyles =
  'bg-[#E0E6D9] text-[#9CA3AF] border-[#E0E6D9] cursor-not-allowed pointer-events-none'

function InteractiveGuideButton({
  variant = 'normal',
  size = 'md',
  label = 'Button',
  disabled = false,
}: {
  variant?: 'normal' | 'outline' | 'icon-text' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  disabled?: boolean
}) {
  const variantStyles = disabled
    ? disabledStyles
    : variant === 'outline'
      ? outlineInteractive
      : normalInteractive

  if (variant === 'icon') {
    const iconSize = size === 'sm' ? 'size-8' : size === 'lg' ? 'size-12' : 'size-10'
    return (
      <button
        type="button"
        disabled={disabled}
        aria-label="Add"
        className={cn(
          'inline-flex items-center justify-center rounded-full border font-medium transition-colors',
          iconSize,
          variantStyles
        )}
      >
        <Plus className={size === 'sm' ? 'size-4' : 'size-5'} />
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg border font-medium transition-colors',
        sizeStyles[size],
        variantStyles
      )}
    >
      {variant === 'icon-text' && <Plus className={size === 'sm' ? 'size-3.5' : 'size-4'} />}
      {label}
    </button>
  )
}

function PlaygroundRow({
  title,
  variant,
}: {
  title: string
  variant: 'normal' | 'outline' | 'icon-text' | 'icon'
}) {
  const sizes = ['sm', 'md', 'lg'] as const
  const sizeLabels = { sm: 'Small', md: 'Medium', lg: 'Large' }

  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-[#1F2E13]">{title}</h4>
      <div className="grid grid-cols-[80px_repeat(3,minmax(0,1fr))] items-center gap-x-6 gap-y-4">
        <div />
        {sizes.map((size) => (
          <p key={size} className="text-xs font-medium text-[#7A6B3F]">
            {sizeLabels[size]}
          </p>
        ))}
        <p className="text-xs text-[#4B5A41]">Default</p>
        {sizes.map((size) => (
          <InteractiveGuideButton key={size} variant={variant} size={size} />
        ))}
        <p className="text-xs text-[#4B5A41]">Disabled</p>
        {sizes.map((size) => (
          <InteractiveGuideButton key={size} variant={variant} size={size} disabled />
        ))}
      </div>
    </div>
  )
}

export function ButtonPlayground() {
  return (
    <div className="space-y-10">
      <PlaygroundRow title="Normal (Solid)" variant="normal" />
      <PlaygroundRow title="Outline" variant="outline" />
      <PlaygroundRow title="Icon + Text" variant="icon-text" />
      <PlaygroundRow title="Icon Only" variant="icon" />
      <p className="border-t border-[#E0E6D9] pt-4 text-xs text-[#7A6B3F]">
        Hover for grey, click and hold for sage green — matching the reference states above.
      </p>
    </div>
  )
}
