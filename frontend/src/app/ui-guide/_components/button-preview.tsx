import { Fragment } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonState = 'default' | 'hover' | 'active' | 'disabled'

const stateStyles = {
  default: 'bg-[#F6C531] text-white border-[#F6C531]',
  hover: 'bg-[#757575] text-white border-[#757575]',
  active: 'bg-[#B2C9AB] text-white border-[#B2C9AB]',
  disabled: 'bg-[#E0E6D9] text-[#9CA3AF] border-[#E0E6D9] cursor-not-allowed',
} as const

const outlineStateStyles = {
  default: 'bg-transparent text-[#F6C531] border-[#F6C531]',
  hover: 'bg-transparent text-[#757575] border-[#757575]',
  active: 'bg-transparent text-[#B2C9AB] border-[#B2C9AB]',
  disabled: 'bg-transparent text-[#9CA3AF] border-[#E0E6D9] cursor-not-allowed',
} as const

const sizeStyles = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
} as const

type GuideButtonProps = {
  variant?: 'normal' | 'outline' | 'icon-text' | 'icon'
  state?: ButtonState
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function GuideButton({
  variant = 'normal',
  state = 'default',
  size = 'md',
  label = 'Button',
}: GuideButtonProps) {
  const isOutline = variant === 'outline'
  const styles = isOutline ? outlineStateStyles : stateStyles

  if (variant === 'icon') {
    const iconSize = size === 'sm' ? 'size-8' : size === 'lg' ? 'size-12' : 'size-10'
    return (
      <button
        type="button"
        disabled={state === 'disabled'}
        className={cn(
          'inline-flex items-center justify-center rounded-full border',
          iconSize,
          styles[state]
        )}
      >
        <Plus className={size === 'sm' ? 'size-4' : 'size-5'} />
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled={state === 'disabled'}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg border font-medium',
        sizeStyles[size],
        styles[state]
      )}
    >
      {variant === 'icon-text' && <Plus className="size-4" />}
      {label}
    </button>
  )
}

export function ButtonStateGrid({
  variant,
  title,
}: {
  variant: 'normal' | 'outline' | 'icon-text' | 'icon'
  title: string
}) {
  const states: ButtonState[] = ['default', 'hover', 'active', 'disabled']
  const sizes = ['sm', 'md', 'lg'] as const
  const sizeLabels = { sm: 'Small', md: 'Medium', lg: 'Large' }

  return (
    <div className="overflow-x-auto">
      <h3 className="mb-4 text-lg font-semibold text-[#1F2E13]">{title}</h3>
      <div className="grid min-w-[700px] grid-cols-5 items-center gap-x-6 gap-y-5">
        <div />
        {states.map((s) => (
          <div key={s} className="text-sm font-medium capitalize text-[#4B5A41]">
            {s}
          </div>
        ))}

        {sizes.map((size) => (
          <Fragment key={size}>
            <div className="text-sm text-[#4B5A41]">{sizeLabels[size]}</div>
            {states.map((state) => (
              <div key={`${size}-${state}`}>
                <GuideButton variant={variant} state={state} size={size} />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
