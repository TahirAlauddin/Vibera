import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CheckboxState = 'default' | 'hover' | 'focused' | 'disabled' | 'error'

export function getCheckboxBoxClass({
  checked,
  state,
  size = 'sm',
}: {
  checked: boolean
  state: CheckboxState
  size?: 'sm' | 'lg'
}) {
  const sizeClass = size === 'lg' ? 'size-6' : 'size-5'

  return cn(
    'flex items-center justify-center rounded border-2 transition-colors',
    sizeClass,
    checked
      ? state === 'disabled'
        ? 'border-[#C4B5D4] bg-[#C4B5D4]'
        : state === 'focused'
          ? 'border-[#F6C531] bg-[#F6C531] ring-2 ring-[#E879A6]/30'
          : 'border-[#F6C531] bg-[#F6C531]'
      : state === 'error'
        ? 'border-[#E10E11] bg-white'
        : state === 'focused'
          ? 'border-[#E879A6] bg-white ring-2 ring-[#E879A6]/30'
          : state === 'hover'
            ? 'border-[#93C5FD] bg-white'
            : state === 'disabled'
              ? 'border-[#E0E6D9] bg-[#F4F6F1]'
              : 'border-[#C4C4C4] bg-white'
  )
}

export function resolveCheckboxState({
  disabled,
  error,
  focused,
  hovered,
}: {
  disabled?: boolean
  error?: boolean
  focused?: boolean
  hovered?: boolean
}): CheckboxState {
  if (disabled) return 'disabled'
  if (error) return 'error'
  if (focused) return 'focused'
  if (hovered) return 'hover'
  return 'default'
}

export function CheckboxPreview({
  checked = false,
  state = 'default',
  size = 'sm',
}: {
  checked?: boolean
  state?: CheckboxState
  size?: 'sm' | 'lg'
}) {
  return (
    <div className={getCheckboxBoxClass({ checked, state, size })}>
      {checked && (
        <Check className={cn('text-white', size === 'lg' ? 'size-4' : 'size-3')} strokeWidth={3} />
      )}
    </div>
  )
}

const STATES: CheckboxState[] = ['default', 'hover', 'focused', 'disabled', 'error']

export function CheckboxMatrix() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="text-left text-[#7A6B3F]">
            <th className="pb-4 pr-4 font-medium">State</th>
            {STATES.map((s) => (
              <th key={s} className="pb-4 pr-6 font-medium capitalize">
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(['Off', 'On'] as const).map((row) => (
            <tr key={row}>
              <td className="py-4 pr-4 font-medium text-[#1F2E13]">{row}</td>
              {STATES.map((state) => (
                <td key={state} className="py-4 pr-6">
                  <CheckboxPreview checked={row === 'On'} state={state} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
