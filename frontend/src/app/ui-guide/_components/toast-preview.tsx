import { AlertTriangle, Check, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastPreviewProps = {
  variant: 'info' | 'error' | 'success' | 'warning'
  title?: string
  message?: string
}

const toastStyles = {
  info: {
    container: 'bg-[#EEF4FF] border-[#93B4E8]',
    icon: 'bg-[#4A7FD4] text-white',
    text: 'text-[#2C4A6E]',
    Icon: Info,
  },
  error: {
    container: 'bg-[#FEF2F2] border-[#F5A5A5]',
    icon: 'bg-[#DC2626] text-white',
    text: 'text-[#7F1D1D]',
    Icon: AlertTriangle,
  },
  success: {
    container: 'bg-[#F0FDF4] border-[#86EFAC]',
    icon: 'bg-[#166534] text-white',
    text: 'text-[#14532D]',
    Icon: Check,
  },
  warning: {
    container: 'bg-[#FFFBEB] border-[#FCD34D]',
    icon: 'bg-[#D97706] text-white',
    text: 'text-[#78350F]',
    Icon: AlertTriangle,
  },
} as const

export function ToastPreview({
  variant,
  title,
  message = 'Notification message. Here will be information.',
}: ToastPreviewProps) {
  const style = toastStyles[variant]
  const Icon = style.Icon

  return (
    <div
      className={cn(
        'flex w-full max-w-xl items-start gap-3 rounded-lg border px-4 py-3',
        style.container
      )}
    >
      <div className={cn('flex size-6 shrink-0 items-center justify-center rounded-full', style.icon)}>
        <Icon className="size-3.5" />
      </div>

      <div className={cn('min-w-0 flex-1', style.text)}>
        {title ? (
          <>
            <p className="text-sm font-bold">{title}</p>
            <p className="text-sm">{message}</p>
          </>
        ) : (
          <p className="text-sm">{message}</p>
        )}
      </div>

      <button type="button" className={cn('shrink-0', style.text)} aria-label="Close">
        <X className="size-4" />
      </button>
    </div>
  )
}
