'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type ToggleSwitchProps = {
  defaultOn?: boolean
  onChange?: (on: boolean) => void
  'aria-label'?: string
}

export function ToggleSwitch({
  defaultOn = false,
  onChange,
  'aria-label': ariaLabel,
}: ToggleSwitchProps) {
  const [on, setOn] = useState(defaultOn)

  const toggle = () => {
    const next = !on
    setOn(next)
    onChange?.(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={toggle}
      className={cn(
        'relative h-6 w-10 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6C531]/50',
        on ? 'bg-[#F6C531]' : 'bg-[#D1D5DB]'
      )}
    >
      <span
        className={cn(
          'absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all',
          on ? 'right-1' : 'left-1'
        )}
      />
    </button>
  )
}
