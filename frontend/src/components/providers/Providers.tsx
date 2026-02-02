'use client'

import { SessionProvider } from './SessionProvider'
import { ToastContextProvider } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ToastContextProvider>
        {children}
        <Toaster />
      </ToastContextProvider>
    </SessionProvider>
  )
}
