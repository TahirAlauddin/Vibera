'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { RadioPreview, resolveRadioState } from './radio-preview'

const OPTIONS = ['Option 1', 'Option 2', 'Option 3', 'Option 4']

function InteractiveRadio({
  label,
  checked,
  disabled = false,
  error = false,
  onSelect,
  onBlur,
}: {
  label: string
  checked: boolean
  disabled?: boolean
  error?: boolean
  onSelect: () => void
  onBlur?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const visualState = resolveRadioState({
    disabled,
    error,
    focused: focused && !disabled,
    hovered: hovered && !disabled && !focused,
  })

  return (
    <label
      className={cn(
        'flex items-center gap-3',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        type="radio"
        name="radio-playground"
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          onBlur?.()
        }}
        className="sr-only"
      />
      <RadioPreview checked={checked} state={visualState} />
      <span className="text-sm text-[#4B5A41]">{label}</span>
    </label>
  )
}

export function RadioPlayground() {
  const [selected, setSelected] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const showError = touched && selected === null

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {OPTIONS.map((option) => (
          <InteractiveRadio
            key={option}
            label={option}
            checked={selected === option}
            error={showError}
            onSelect={() => {
              setSelected(option)
              setTouched(true)
            }}
            onBlur={() => setTouched(true)}
          />
        ))}
      </div>

      <p className="border-t border-[#E0E6D9] pt-4 text-sm text-[#7A6B3F]">
        {selected ? (
          <>
            Selected: <span className="font-medium text-[#1F2E13]">{selected}</span>
          </>
        ) : touched ? (
          <span className="text-[#E10E11]">Please select an option.</span>
        ) : (
          'Select an option — hover for blue border, Tab for pink focus ring.'
        )}
      </p>
    </div>
  )
}
