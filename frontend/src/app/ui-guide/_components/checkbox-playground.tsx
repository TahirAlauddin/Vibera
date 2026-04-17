'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

function InteractiveCheckbox({
  label,
  defaultChecked = false,
  disabled = false,
}: {
  label: string
  defaultChecked?: boolean
  disabled?: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && setChecked((v) => !v)}
        className={cn(
          'flex size-5 items-center justify-center rounded border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6C531]/50',
          checked ? 'border-[#F6C531] bg-[#F6C531]' : 'border-[#C4C4C4] bg-white'
        )}
      >
        {checked && <Check className="size-3 text-white" strokeWidth={3} />}
      </button>
      <span className="text-sm text-[#4B5A41]">{label}</span>
    </label>
  )
}

export function CheckboxPlayground() {
  return (
    <div className="space-y-3">
      <InteractiveCheckbox label="Remember me" defaultChecked />
      <InteractiveCheckbox label="Send notifications" />
      <InteractiveCheckbox label="Accept terms and conditions" />
      <InteractiveCheckbox label="Disabled option" disabled />
    </div>
  )
}
