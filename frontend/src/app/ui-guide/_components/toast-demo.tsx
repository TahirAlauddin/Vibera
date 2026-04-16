'use client'

import { Button } from '@/components/custom/button'
import { useToast } from '@/components/ui/use-toast'

export function ToastDemo() {
  const { toast } = useToast()

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="sm"
        variant="primary"
        onClick={() => toast({ variant: 'info', message: 'Notification message. Here will be information.' })}
      >
        Info
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => toast({ variant: 'error', message: 'Notification message. Here will be information.' })}
      >
        Error
      </Button>
      <Button
        size="sm"
        variant="primary"
        onClick={() => toast({ variant: 'success', message: 'Notification message. Here will be information.' })}
      >
        Success
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toast({ variant: 'warning', message: 'Notification message. Here will be information.' })}
      >
        Warning
      </Button>
    </div>
  )
}
