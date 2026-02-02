'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check, X, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'correct' | 'error' | 'info' | 'warning' | 'message'

const ToastProvider = ToastPrimitives.Provider

// Environment variables for toast positioning
const TOAST_POSITION_TOP = process.env.NEXT_PUBLIC_TOAST_POSITION_TOP || 'top-4'
const TOAST_POSITION_RIGHT = process.env.NEXT_PUBLIC_TOAST_POSITION_RIGHT || 'right-4'
const TOAST_MAX_WIDTH = process.env.NEXT_PUBLIC_TOAST_MAX_WIDTH || '420'

const ToastViewport = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      `fixed ${TOAST_POSITION_TOP} ${TOAST_POSITION_RIGHT} z-50 flex max-h-screen w-full flex-col gap-2 md:max-w-[${TOAST_MAX_WIDTH}px]`,
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-lg border px-4 py-3 pr-8 text-sm transition-all',
  {
    variants: {
      variant: {
        correct: 'bg-green-50 border border-green-300 text-black hover:bg-green-100',
        error: 'bg-red-50 border border-red-300 text-black hover:bg-red-100',
        info: 'bg-blue-50 border border-blue-300 text-black hover:bg-blue-100',
        warning: 'bg-orange-50 border border-orange-300 text-black hover:bg-orange-100',
        message: 'bg-white border border-black text-black hover:bg-gray-100',
      },
    },
    defaultVariants: {
      variant: 'message',
    },
  }
)

const iconVariants = cva('flex items-center justify-center rounded-full shrink-0 size-6', {
  variants: {
    variant: {
      correct: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      info: 'bg-blue-500 text-white',
      warning: 'bg-orange-600 text-white',
      message: '',
    },
  },
  defaultVariants: {
    variant: 'message',
  },
})

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  message: string
}

const Toast = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, message, ...props }, ref) => {
  const getIcon = () => {
    switch (variant) {
      case 'correct':
        return <Check className="size-4" />
      case 'error':
        return <X className="size-4" />
      case 'info':
        return <Info className="size-4" />
      case 'warning':
        return <AlertTriangle className="size-4" />
      default:
        return null
    }
  }

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {variant !== 'message' && (
        <div className={cn(iconVariants({ variant }))}>{getIcon()}</div>
      )}
      <span className="flex-1">{message}</span>
      <ToastPrimitives.Close className="absolute right-2 top-2 rounded-md p-1 text-black opacity-0 transition-opacity hover:text-gray-700 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100">
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

export { Toast, ToastProvider, ToastViewport }
