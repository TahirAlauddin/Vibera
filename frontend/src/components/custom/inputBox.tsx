import * as React from 'react'
import { cn } from '@/lib/utils'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { inputGroupVariants } from './input-varient'
import { VariantProps } from 'class-variance-authority'
import { Search } from 'lucide-react'

type InputBoxProps = React.ComponentProps<typeof InputGroupInput> & {
  state?: VariantProps<typeof inputGroupVariants>['state']
  containerClassName?: string
}

export function InputBox({
  state = 'default',
  containerClassName,
  className,
  disabled,
  ...props
}: InputBoxProps) {
  return (
    <InputGroup className={cn('w-[394px] h-11.25', inputGroupVariants({ state }), containerClassName)}>
      <InputGroupAddon align="inline-start" >
        <Search className="h-3 w-3" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end" >
        <Search className="h-3 w-3" />
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
