'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function InteractiveToggle({
  defaultOn = false,
  size = 'sm',
  label,
  disabled = false,
}: {
  defaultOn?: boolean
  size?: 'sm' | 'lg'
  label?: string
  disabled?: boolean
}) {
  const [on, setOn] = useState(defaultOn)
  const trackClass = size === 'lg' ? 'h-7 w-12' : 'h-6 w-10'
  const knobClass = size === 'lg' ? 'size-5' : 'size-4'

  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => setOn((v) => !v)}
      className={cn(
        'relative rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6C531]/50',
        trackClass,
        on ? 'bg-[#F6C531]' : 'bg-[#D1D5DB]',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all',
          knobClass,
          on ? 'right-1' : 'left-1'
        )}
      />
    </button>
  )

  if (label) {
    return (
      <div className="flex items-center justify-between gap-4 max-w-sm">
        <span className="text-sm text-[#4B5A41]">{label}</span>
        {toggle}
      </div>
    )
  }

  return toggle
}

export function TogglePlayground() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-10">
        <div className="text-center">
          <InteractiveToggle size="sm" />
          <p className="mt-2 text-xs text-[#7A6B3F]">Small</p>
        </div>
        <div className="text-center">
          <InteractiveToggle size="lg" />
          <p className="mt-2 text-xs text-[#7A6B3F]">Large</p>
        </div>
      </div>

      <div className="space-y-4 border-t border-[#E0E6D9] pt-6">
        <InteractiveToggle label="Enable notifications" defaultOn />
        <InteractiveToggle label="Dark mode" />
        <InteractiveToggle label="Auto-save entries" defaultOn />
        <InteractiveToggle label="Disabled toggle" disabled />
      </div>
    </div>
  )
}
