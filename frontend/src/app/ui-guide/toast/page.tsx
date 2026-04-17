import type { Metadata } from 'next'
import { UIGuideShell, GuideSection, TryItYourself } from '../_components/ui-guide-shell'
import { ToastPreview } from '../_components/toast-preview'
import { ToastDemo } from '../_components/toast-demo'

export const metadata: Metadata = {
  title: 'Toast | Vibera UI Guide',
  description: 'Notification toast components',
}

export default function ToastPage() {
  return (
    <UIGuideShell
      showBack
      title="Toast Component"
      description="Info, error, success, and warning notification toasts"
    >
      <GuideSection title="With Title (reference)">
        <div className="space-y-4">
          <ToastPreview variant="info" title="Info notification" />
          <ToastPreview variant="error" title="Error notification" />
          <ToastPreview variant="success" title="Success notification" />
          <ToastPreview variant="warning" title="Warning notification" />
        </div>
      </GuideSection>

      <GuideSection title="Simple (reference)">
        <div className="space-y-4">
          <ToastPreview variant="info" />
          <ToastPreview variant="error" />
          <ToastPreview variant="success" />
          <ToastPreview variant="warning" />
        </div>
      </GuideSection>

      <TryItYourself hint="Click a button to trigger a live toast notification.">
        <ToastDemo />
      </TryItYourself>
    </UIGuideShell>
  )
}
