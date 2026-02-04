'use client'

import { SessionProvider } from './SessionProvider'
import { Toaster } from '@/components/ui/toaster'
import { ReactNode } from 'react'
import { useEffect } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  // #region agent log
  useEffect(() => {
    const logDataMount = {location:'Providers.tsx:7',message:'Providers component rendering/mounting',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    fetch('http://127.0.0.1:7242/ingest/6e222ad1-38db-49c9-b946-37f1317673cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataMount)}).catch(()=>{});
    return () => {
      const logDataUnmount = {location:'Providers.tsx:7',message:'Providers component unmounting',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
      fetch('http://127.0.0.1:7242/ingest/6e222ad1-38db-49c9-b946-37f1317673cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataUnmount)}).catch(()=>{});
    };
  }, []);
  // #endregion agent log
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  )
}
