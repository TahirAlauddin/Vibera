import type { Metadata } from 'next'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'
import { ToggleMatrix } from '../_components/toggle-preview'

export const metadata: Metadata = {
  title: 'Toggle | Vibera UI Guide',
  description: 'Toggle switch components',
}

export default function TogglePage() {
  return (
    <UIGuideShell
      showBack
      title="Toggle"
      description="On/off switch controls in small and large sizes"
    >
      <GuideSection title="Sizes">
        <ToggleMatrix />
      </GuideSection>

      <GuideSection title="With Labels">
        <div className="space-y-4">
          {[
            { label: 'Enable notifications', on: true },
            { label: 'Dark mode', on: false },
            { label: 'Auto-save entries', on: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between max-w-sm">
              <span className="text-sm text-[#4B5A41]">{item.label}</span>
              <div
                className={`relative h-6 w-10 rounded-full transition-colors ${
                  item.on ? 'bg-[#F6C531]' : 'bg-[#D1D5DB]'
                }`}
              >
                <div
                  className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-sm ${
                    item.on ? 'right-1' : 'left-1'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </GuideSection>
    </UIGuideShell>
  )
}
