import * as React from 'react'
import { cn } from '@/lib/utils'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { inputGroupVariants } from './input-varient'
import { VariantProps } from 'class-variance-authority'
import { Search, X } from 'lucide-react'

type InputBoxProps = React.ComponentProps<typeof InputGroupInput> & {
  state?: VariantProps<typeof inputGroupVariants>['state']
  variant?: 'primary' | 'accent' | 'secondary-accent'
  containerClassName?: string
  onClear?: () => void
}

export function InputBox({
  state = 'default',
  variant = 'primary',
  containerClassName,
  className,
  disabled,
  onClear,
  ...props
}: InputBoxProps) {
  // Determine the effective state based on variant
  const effectiveState =
    variant === 'accent' ? 'accent' : variant === 'secondary-accent' ? 'secondary-accent' : state
  const showClearButton = variant === 'accent' || variant === 'secondary-accent'

  return (
    <InputGroup
      className={cn(
        'w-[394px] h-11.25 shadow-input!',
        inputGroupVariants({ state: effectiveState }),
        containerClassName
      )}
    >
      <InputGroupAddon align="inline-start">
        <Search className="h-3 w-3" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        {showClearButton ? (
          <button type="button" onClick={onClear} className="cursor-pointer">
            <X className="h-4 w-4 text-black" strokeWidth={2.5} />
          </button>
        ) : (
          <Search className="h-3 w-3" />
        )}
      </InputGroupAddon>

      <InputGroupInput
        disabled={disabled || state === 'disabled'}
        aria-invalid={state === 'error'}
        className={cn(
          'bg-transparent',
          disabled ? 'text-input-disabledText placeholder:text-input-disabledText' : '',
          className
        )}
        {...props}
      />
    </InputGroup>
  )
}
