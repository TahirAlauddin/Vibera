'use client'

import { Toaster as Sonner } from 'sonner'
import { cn } from '@/lib/utils'
import { memo } from 'react'

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Toaster component wrapper for Sonner.
 * Uses Sonner's default position behavior (bottom-right) when no position prop.
 * All Sonner props are passed through via {...props}, allowing full customization.
 * Memoized to prevent unnecessary re-renders that could cause toast duplication.
 */
const Toaster = memo(({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster"
      closeButton
      position="bottom-right"
      visibleToasts={5}
      expand={false}
      richColors={false}
      toastOptions={{
        classNames: {
          // Base toast styles - child element styling only
          // Variant styles (background, border, etc.) are applied via classNames in use-toast.tsx
          toast: cn(
            // Minimal styling - let Sonner handle positioning and stacking
            // Only style content
            '[&_[data-title]]:text-black [&_[data-title]]:flex-1 [&_[data-title]]:pr-2 [&_[data-title]]:min-w-0',
            // Icon spacing - increased gap between icon and text
            '[&_[data-icon]]:mr-5 [&_[data-icon]]:shrink-0',
            // Make toast a group for hover state
            'group',
            // Close button visibility on hover
            '[&:hover_.sonner-close-button]:!opacity-100',
            '[&:hover_button[aria-label*="close"]]:!opacity-100',
            '[&:hover_button[aria-label*="Close"]]:!opacity-100',
            '[&:hover_[data-close-button]]:!opacity-100'
          ),
          actionButton: 'hidden',
          cancelButton: 'hidden',
          closeButton: cn(
            // Simple X icon - no round button, just the X
            // Position: inline with content, not absolute, last in order
            '!opacity-0 !transition-opacity !duration-200 !ease-in-out',
            // Fix vertical alignment: flex (not inline-flex) + self-center + leading-none prevents baseline alignment
            '!text-black !relative !flex !items-center !justify-center !self-center !leading-none',
            '!m-0 !p-0 !ml-2 !shrink-0', // Small left margin to space from text, don't shrink
            '!bg-transparent !border-none !cursor-pointer',
            '!w-auto !h-auto !min-w-0 !min-h-0',
            '!rounded-none !shadow-none', // No rounded corners, no shadow
            '!order-[1]', // Ensure it's last in flex order (Icon: -1, Text: 0, Close: 1)
            // Remove any default button styling (round background, etc.)
            'hover:!bg-transparent active:!bg-transparent focus:!bg-transparent',
            'focus:!outline-none focus-visible:!outline-none focus-visible:!ring-0',
            'before:!content-none after:!content-none', // Remove any pseudo-elements
            // X icon styling - 1.25rem size (w-5 h-5 = 1.25rem)
            '[&_svg]:!w-5 [&_svg]:!h-5 [&_svg]:!text-black [&_svg]:!stroke-current [&_svg]:!block [&_svg]:!m-0',
            // Show on hover of parent toast
            'group-hover:!opacity-100',
            // Ensure it's not positioned outside
            '!inset-auto !left-auto !right-auto !top-auto !bottom-auto'
          ),
        },
      }}
      {...props}
    />
  )
})

Toaster.displayName = 'Toaster'

export { Toaster }
