'use client'

import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'relative flex w-full items-center gap-4 overflow-visible rounded-lg border px-4 py-3 pr-12 text-sm text-black',
          actionButton: 'hidden',
          cancelButton: 'hidden',
          closeButton: 'sonner-close-button',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
