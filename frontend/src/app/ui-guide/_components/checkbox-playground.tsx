'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  CheckboxPreview,
  resolveCheckboxState,
} from './checkbox-preview'

function InteractiveCheckbox({
  label,
  defaultChecked = false,
  disabled = false,
  error = false,
  helperText,
}: {
  label: string
  defaultChecked?: boolean
  disabled?: boolean
  error?: boolean
  helperText?: string
}) {
  const [checked, setChecked] = useState(defaultChecked)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [touched, setTouched] = useState(false)

  const showError = error && touched && !checked
  const visualState = resolveCheckboxState({
    disabled,
    error: showError,
    focused: focused && !disabled,
    hovered: hovered && !disabled && !focused,
  })

  return (
    <div className="space-y-1">
      <label
        className={cn(
          'flex items-center gap-3',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-invalid={showError}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setChecked((v) => !v)
              setTouched(true)
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            setTouched(true)
          }}
          className="rounded focus:outline-none"
        >
          <CheckboxPreview checked={checked} state={visualState} />
        </button>
        <span className="text-sm text-[#4B5A41]">{label}</span>
      </label>
      {showError && helperText && (
        <p className="pl-8 text-xs text-[#E10E11]">{helperText}</p>
      )}
    </div>
  )
}

export function CheckboxPlayground() {
  return (
    <div className="space-y-4">
      <InteractiveCheckbox label="Remember me" defaultChecked />
      <InteractiveCheckbox label="Send notifications" />
      <InteractiveCheckbox
        label="Accept terms and conditions"
        error
        helperText="You must accept the terms to continue."
      />
      <InteractiveCheckbox label="Disabled option" disabled />
      <p className="border-t border-[#E0E6D9] pt-4 text-xs text-[#7A6B3F]">
        Hover for blue border, focus (Tab) for pink ring, leave terms unchecked for error state.
      </p>
    </div>
  )
}
