'use client'

import { toast as sonnerToast } from 'sonner'
import type { ReactNode } from 'react'
import { Check, X, Info, AlertTriangle } from 'lucide-react'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning' | 'message'

/**
 * Input type for creating a toast notification.
 * @property variant - The visual style of the toast
 * @property message - The message to display (supports string or JSX)
 * @property duration - Duration in milliseconds (0 or undefined for infinite)
 */
export type ToastInput = {
  variant: ToastVariant
  message: string | ReactNode
  duration?: number
}

/**
 * Toast ID returned from Sonner for programmatic dismissal.
 * Can be a string or number.
 */
export type ToastId = string | number

const DEFAULT_DURATION = parseInt(process.env.NEXT_PUBLIC_TOAST_DURATION || '5000', 10) // milliseconds

/**
 * Hook for displaying toast notifications using Sonner.
 * 
 * @returns An object with `toast` and `dismiss` functions
 * 
 * @example
 * ```tsx
 * const { toast, dismiss } = useToast()
 * 
 * // Show a success toast
 * const id = toast({ variant: 'success', message: 'Success!' })
 * 
 * // Dismiss a specific toast
 * dismiss(id)
 * 
 * // Dismiss all toasts
 * dismiss()
 * ```
 */
export function useToast() {
  /**
   * Displays a toast notification.
   * 
   * @param input - Toast configuration
   * @returns The toast ID for programmatic dismissal
   */
  const toast = ({ variant, message, duration = DEFAULT_DURATION }: ToastInput): ToastId => {
    const options = {
      duration: duration > 0 ? duration : undefined, // Sonner uses undefined for infinite duration
      className: `toast-variant-${variant}`, // Add variant class for styling
    }

    // Use Sonner's type-specific methods with custom icons wrapped in circular containers
    switch (variant) {
      case 'success':
        return sonnerToast.success(message, {
          ...options,
          icon: (
            <div className="flex items-center justify-center rounded-full bg-green-600 text-white size-6 shrink-0">
              <Check className="size-4" />
            </div>
          ),
        })
      case 'error':
        return sonnerToast.error(message, {
          ...options,
          icon: (
            <div className="flex items-center justify-center rounded-full bg-red-600 text-white size-6 shrink-0">
              <X className="size-4" />
            </div>
          ),
        })
      case 'info':
        return sonnerToast.info(message, {
          ...options,
          icon: (
            <div className="flex items-center justify-center rounded-full bg-blue-500 text-white size-6 shrink-0">
              <Info className="size-4" />
            </div>
          ),
        })
      case 'warning':
        return sonnerToast.warning(message, {
          ...options,
          icon: (
            <div className="flex items-center justify-center rounded-full bg-orange-600 text-white size-6 shrink-0">
              <AlertTriangle className="size-4" />
            </div>
          ),
        })
      case 'message':
      default:
        return sonnerToast(message, options) // No icon for message variant
    }
  }

  /**
   * Dismisses a toast notification.
   * 
   * @param id - The toast ID returned from `toast()`. If omitted, dismisses all toasts.
   */
  const dismiss = (id?: ToastId): void => {
    if (id !== undefined) {
      sonnerToast.dismiss(id)
    } else {
      sonnerToast.dismiss() // Dismiss all toasts
    }
  }

  return {
    toast,
    dismiss,
  }
}
