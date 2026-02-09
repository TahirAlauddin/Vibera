import { cva } from 'class-variance-authority'

export const inputGroupVariants = cva(
  // base overrides MUST come first
  'border transition-colors shadow-input',
  {
    variants: {
      state: {
        default: 'bg-input border-black shadow-input',

        focused: 'bg-input-active border-black shadow-input',

        filled: 'bg-input-active border-black shadow-input',

        error: 'bg-input-active border-input-error shadow-input',

        disabled: 'bg-input-active border-input-active text-input-disabledText shadow-input',
        accent: '!bg-input-accent border-input-accent shadow-input',

        'secondary-accent': '!bg-input-secondary-accent border-input-secondary-accent shadow-input',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)
