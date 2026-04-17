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

export function MultiSelectPreview({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(['Option 1', 'Option 3'])
  const [hovered, setHovered] = useState<string | null>(null)

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    )
  }

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected((prev) => prev.filter((item) => item !== option))
  }

  return (
    <div className={cn('relative w-full max-w-xs', className)}>
      <div
        role="combobox"
        aria-expanded={open}
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((v) => !v)
          }
        }}
        className="flex min-h-11 w-full cursor-pointer flex-wrap items-center gap-1 rounded-lg border border-[#E0E6D9] bg-[#F9F6F0] px-3 py-2 text-left"
      >
        {selected.length === 0 ? (
          <span className="text-sm text-[#7A6B3F]">Select...</span>
        ) : (
          selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-md bg-[#F6C531]/30 px-2 py-0.5 text-xs font-medium text-[#1F2E13]"
            >
              {item}
              <button
                type="button"
                onClick={(e) => removeOption(item, e)}
                className="rounded-sm leading-none hover:bg-[#F6C531]/40"
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </span>
          ))
        )}
        <ChevronDown
          className={cn('ml-auto size-4 shrink-0 text-[#4B5A41] transition-transform', open && 'rotate-180')}
        />
      </div>

      {open && (
        <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-[#E0E6D9] bg-white shadow-md">
          {OPTIONS.map((option) => {
            const isSelected = selected.includes(option)
            return (
              <button
                key={option}
                type="button"
                onMouseEnter={() => setHovered(option)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => toggleOption(option)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2.5 text-left text-sm',
                  hovered === option || isSelected
                    ? 'bg-[#D7E9B6] text-[#1F2E13]'
                    : 'text-[#4B5A41] hover:bg-[#D7E9B6]'
                )}
              >
                {option}
                {isSelected && <Check className="size-4" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
