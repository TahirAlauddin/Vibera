'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const OPTIONS = ['Option 1', 'Option 2', 'Option 3', 'Option 4']

type DropdownPreviewProps = {
  placeholder?: string
  defaultOpen?: boolean
  className?: string
}

export function DropdownPreview({
  placeholder = 'Select...',
  defaultOpen = false,
  className,
}: DropdownPreviewProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [selected, setSelected] = useState<string | null>(defaultOpen ? 'Option 2' : null)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className={cn('relative w-full max-w-xs', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#E0E6D9] bg-[#F9F6F0] px-4 text-sm text-[#4B5A41]"
      >
        <span>{selected ?? placeholder}</span>
        <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-[#E0E6D9] bg-white shadow-md">
          {OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onMouseEnter={() => setHovered(option)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setSelected(option)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center justify-between px-4 py-2.5 text-left text-sm',
                hovered === option || selected === option
                  ? 'bg-[#D7E9B6] text-[#1F2E13]'
                  : 'text-[#4B5A41] hover:bg-[#D7E9B6]'
              )}
            >
              {option}
              {selected === option && <Check className="size-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function MultiSelectPreview() {
  const selected = ['Option 1', 'Option 3']

  return (
    <div className="flex h-11 w-full max-w-xs flex-wrap items-center gap-1 rounded-lg border border-[#E0E6D9] bg-[#F9F6F0] px-3 py-2">
      {selected.map((item) => (
        <span
          key={item}
          className="rounded-md bg-[#F6C531]/30 px-2 py-0.5 text-xs font-medium text-[#1F2E13]"
        >
          {item}
        </span>
      ))}
      <ChevronDown className="ml-auto size-4 text-[#4B5A41]" />
    </div>
  )
}
