'use client'

import { toast as sonnerToast } from 'sonner'
import type { ReactNode } from 'react'
import { Check, X, Info, AlertCircle } from 'lucide-react'
import { toastVariants, type ToastVariantProps } from './toast-variants'


export type ToastVariant = NonNullable<ToastVariantProps['variant']>

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
    // Generate type-safe className using CVA
    // This includes all base styles + variant-specific styles
    const variantClassName = toastVariants({ variant })

    const options = {
      duration: duration > 0 ? duration : undefined, // Sonner uses undefined for infinite duration
      classNames: {
        // Sonner merges this with toastOptions.classNames.toast from Toaster component
        // The variant classes include all necessary base styles
        toast: variantClassName,
      },
    }

    // Use Sonner's type-specific methods with custom icons wrapped in circular containers
    let toastId: ToastId
    switch (variant) {
      case 'success': {
        toastId = sonnerToast.success(message, {
          ...options,
          icon: (
            <div className="flex items-center justify-center rounded-full bg-green-600 text-white size-6 shrink-0">
              <Check className="size-4" />
            </div>
          ),
        })
        return toastId
      }
      case 'error': {
        toastId = sonnerToast.error(message, {
          ...options,
          icon: (
            <div className="flex items-center justify-center rounded-full bg-red-600 text-white size-6 shrink-0">
              <X className="size-4" />
            </div>
          ),
        })
        return toastId
      }
      case 'info': {
        toastId = sonnerToast.info(message, {
          ...options,
          icon: (
            <div className="flex items-center justify-center rounded-full bg-blue-500 text-white size-6 shrink-0">
              <Info className="size-4" />
            </div>
          ),
        })
        return toastId
      }
      case 'warning': {
        toastId = sonnerToast.warning(message, {
          ...options,
          icon: (
            <div className="flex items-center justify-center rounded-full bg-orange-600 text-white size-6 shrink-0">
              <AlertCircle className="size-4" />
            </div>
          ),
        })
        return toastId
      }
      case 'message':
      default: {
        toastId = sonnerToast(message, options) // No icon for message variant
        return toastId
      }
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
