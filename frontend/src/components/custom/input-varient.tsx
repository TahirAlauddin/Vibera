import { cva } from 'class-variance-authority'

export const inputGroupVariants = cva(
  // base overrides MUST come first
  'border transition-colors',
  {
    variants: {
      state: {
        default:
          'bg-input border-black',

        focused:
          'bg-input-active border-black',

        filled:
          'bg-input-active border-black',

        error:
          'bg-input-active border-input-error',

        disabled:
          'bg-input-active border-input-active text-input-disabledText',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)
