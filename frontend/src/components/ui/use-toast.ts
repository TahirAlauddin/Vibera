'use client'

import * as React from 'react'
import type { ToastProps, ToastVariant } from './toast'

export type Toast = {
  id: string
  variant: ToastVariant
  message: string
  open: boolean
  duration?: number
}

const TOAST_LIMIT = parseInt(process.env.NEXT_PUBLIC_TOAST_LIMIT || '5', 10)
const DEFAULT_DURATION = parseInt(process.env.NEXT_PUBLIC_TOAST_DURATION || '5000', 10) // milliseconds

const ToastContext = React.createContext<{
  toasts: Toast[]
  toast: (props: Omit<Toast, 'id' | 'open'>) => void
  dismiss: (id: string) => void
} | null>(null)

export function ToastContextProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const timeoutsRef = React.useRef<Map<string, NodeJS.Timeout>>(new Map())

  const dismiss = React.useCallback((id: string) => {
    // Clear timeout if exists
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    ({ variant, message, duration = DEFAULT_DURATION }: Omit<Toast, 'id' | 'open'>) => {
      const id = Math.random().toString(36).substring(2, 9)
      
      setToasts((prev) => {
        const newToasts = [{ id, variant, message, open: true, duration }, ...prev]
        // Limit number of toasts
        return newToasts.slice(0, TOAST_LIMIT)
      })

      // Auto-dismiss after duration
      if (duration > 0) {
        const timeout = setTimeout(() => {
          dismiss(id)
        }, duration)
        timeoutsRef.current.set(id, timeout)
      }
    },
    [dismiss]
  )

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
