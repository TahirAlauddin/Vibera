import type { Metadata } from 'next'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'
import { CheckboxMatrix } from '../_components/checkbox-preview'

export const metadata: Metadata = {
  title: 'Checkboxes | Vibera UI Guide',
  description: 'Checkbox component states and variants',
}

export default function CheckboxesPage() {
  return (
    <UIGuideShell
      showBack
      title="Checkboxes"
      description="Checkbox states: default, hover, focused, disabled, and error"
    >
      <GuideSection title="State Matrix">
        <CheckboxMatrix />
      </GuideSection>

      <GuideSection title="With Labels">
        <div className="space-y-3">
          {['Remember me', 'Send notifications', 'Accept terms and conditions'].map((label, i) => (
            <label key={label} className="flex cursor-pointer items-center gap-3">
              <div
                className={`flex size-5 items-center justify-center rounded border-2 ${
                  i === 0 ? 'border-[#F6C531] bg-[#F6C531]' : 'border-[#C4C4C4] bg-white'
                }`}
              >
                {i === 0 && (
                  <svg className="size-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#4B5A41]">{label}</span>
            </label>
          ))}
        </div>
      </GuideSection>
    </UIGuideShell>
  )
}
