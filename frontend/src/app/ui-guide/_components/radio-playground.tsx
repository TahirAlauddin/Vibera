'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const OPTIONS = ['Option 1', 'Option 2', 'Option 3', 'Option 4']

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        'flex size-5 items-center justify-center rounded-full border-2',
        checked ? 'border-[#E879A6]' : 'border-[#C4C4C4]'
      )}
    >
      {checked && <div className="size-2.5 rounded-full bg-[#E879A6]" />}
    </div>
  )
}

export function RadioPlayground() {
  const [selected, setSelected] = useState(OPTIONS[0])

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {OPTIONS.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="radio-playground"
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
              className="sr-only"
            />
            <RadioDot checked={selected === option} />
            <span className="text-sm text-[#4B5A41]">{option}</span>
          </label>
        ))}
      </div>
      <p className="border-t border-[#E0E6D9] pt-4 text-sm text-[#7A6B3F]">
        Selected: <span className="font-medium text-[#1F2E13]">{selected}</span>
      </p>
    </div>
  )
}
