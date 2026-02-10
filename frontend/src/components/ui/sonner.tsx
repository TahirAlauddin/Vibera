'use client'

import { Toaster as Sonner } from 'sonner'
import { memo } from 'react'

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Toaster component wrapper for Sonner.
 * Uses custom toast components via toast.custom(), so minimal styling is needed.
 * Preserves Sonner's position, stacking, and animation behavior.
 * All Sonner props are passed through via {...props}, allowing full customization.
 * Memoized to prevent unnecessary re-renders that could cause toast duplication.
 */
const Toaster = memo(({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster"
      closeButton={false}
      position="bottom-right"
      visibleToasts={5}
      expand={false}
      richColors={false}
      {...props}
    />
  )
})

Toaster.displayName = 'Toaster'

export { Toaster }
