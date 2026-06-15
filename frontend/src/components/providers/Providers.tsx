'use client'

import { SessionProvider } from './SessionProvider'
import { Toaster } from '@/components/ui/toaster'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  )
}
