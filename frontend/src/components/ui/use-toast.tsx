'use client'

import { toast as sonnerToast } from 'sonner'
import type { ReactNode } from 'react'
import { Check, X, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToastVariantProps } from './toast-variants'

export type ToastVariant = NonNullable<ToastVariantProps['variant']>


const DEFAULT_DURATION = parseInt(process.env.NEXT_PUBLIC_TOAST_DURATION || '5000', 10) // milliseconds

/**
 * Variant configuration matching the design specifications.
 * Defines colors, borders, hover states, and icons for each variant.
 */
const variantConfig = {
  success: {
    bg: 'bg-green-50',
    bgHover: 'hover:bg-green-100',
    border: 'border-green-500',
    iconBg: 'bg-green-600',
    icon: Check,
  },
  error: {
    bg: 'bg-red-50',
    bgHover: 'hover:bg-red-100',
    border: 'border-red-500',
    iconBg: 'bg-red-600',
    icon: X,
  },
  info: {
    bg: 'bg-blue-50',
    bgHover: 'hover:bg-blue-100',
    border: 'border-blue-500',
    iconBg: 'bg-blue-500',
    icon: Info,
  },
  warning: {
    bg: 'bg-orange-50',
    bgHover: 'hover:bg-orange-100',
    border: 'border-orange-500',
    iconBg: 'bg-orange-600',
    icon: AlertTriangle,
  },
  message: {
    bg: 'bg-white',
    bgHover: 'hover:bg-gray-100',
    border: 'border-black',
    iconBg: null,
    icon: null,
  },
} as const

/**
 * Custom toast component that renders the layout: icon → message → close button
 * All elements are horizontally evenly spaced and vertically centered.
 */
function CustomToast({
  id,
  variant,
  message,
}: {
  id: string | number
  variant: ToastVariant
  message: string | ReactNode
}) {
  const config = variantConfig[variant]
  const IconComponent = config.icon

  return (
    <div
      className={cn(
        'group flex items-center justify-between gap-4 w-full min-w-[320px] px-4 py-3 rounded-lg border transition-colors',
        config.bg,
        config.bgHover,
        config.border
      )}
    >
      {/* Icon container - only render if variant has an icon */}
      {IconComponent && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full text-white size-6 shrink-0',
            config.iconBg
          )}
        >
          <IconComponent className="size-4" />
        </div>
      )}

      {/* Message text - flexible width, black text */}
      <div className="flex-1 text-black text-sm min-w-0">{message}</div>

      {/* Close button - visible only on hover */}
      <button
        onClick={() => sonnerToast.dismiss(id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out text-black shrink-0 cursor-pointer bg-transparent border-none p-0 m-0 w-auto h-auto"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>
    </div>
  )
}

/**
 * Hook for displaying toast notifications using Sonner.
 * 
 * @returns An object with `toast` function
 * 
 * @example
 * ```tsx
 * const { toast } = useToast()
 * 
 * // Show a success toast
 * toast({ variant: 'success', message: 'Success!' })
 * ```
 */
export function useToast() {
  /**
 * Displays a toast notification.
 * 
 * @param input - Toast configuration
 * @returns The toast ID for programmatic dismissal
 */
  const toast = ({ variant, message, duration = DEFAULT_DURATION }: { variant: ToastVariant; message: string | ReactNode; duration?: number }): string | number => {
    // Auto-dismiss using DEFAULT_DURATION (or specified duration)
    // If duration is 0, set to undefined for infinite duration (no auto-dismiss)
    const toastDuration = duration > 0 ? duration : undefined

    return sonnerToast.custom(
      (id) => <CustomToast id={id} variant={variant} message={message} />,
      {
        duration: toastDuration, // Sonner uses undefined for infinite duration
      }
    )
  }

  return {
    toast,
  }
}
