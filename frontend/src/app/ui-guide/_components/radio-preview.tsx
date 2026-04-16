import { cn } from '@/lib/utils'

type RadioState = 'default' | 'hover' | 'focused' | 'disabled' | 'error'

export function RadioPreview({
  checked = false,
  state = 'default',
  size = 'sm',
}: {
  checked?: boolean
  state?: RadioState
  size?: 'sm' | 'lg'
}) {
  const outerSize = size === 'lg' ? 'size-6' : 'size-5'
  const innerSize = size === 'lg' ? 'size-3' : 'size-2.5'

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-2',
        outerSize,
        checked
          ? state === 'disabled'
            ? 'border-[#C4B5D4]'
            : state === 'focused'
              ? 'border-[#E879A6] ring-2 ring-[#E879A6]/30'
              : 'border-[#E879A6]'
          : state === 'error'
            ? 'border-[#E10E11]'
            : state === 'hover'
              ? 'border-[#93C5FD]'
              : state === 'disabled'
                ? 'border-[#E0E6D9]'
                : 'border-[#C4C4C4]'
      )}
    >
      {checked && (
        <div
          className={cn(
            'rounded-full',
            innerSize,
            state === 'disabled' ? 'bg-[#C4B5D4]' : 'bg-[#E879A6]'
          )}
        />
      )}
    </div>
  )
}

const STATES: RadioState[] = ['default', 'hover', 'focused', 'disabled', 'error']

export function RadioMatrix() {
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
                  <RadioPreview checked={row === 'On'} state={state} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function RadioList() {
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4']

  return (
    <div className="space-y-3">
      {options.map((option, i) => (
        <label key={option} className="flex cursor-pointer items-center gap-3">
          <RadioPreview checked={i === 0} />
          <span className="text-sm text-[#4B5A41]">{option}</span>
        </label>
      ))}
    </div>
  )
}
