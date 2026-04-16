import type { Metadata } from 'next'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'

export const metadata: Metadata = {
  title: 'Spacing System | Vibera UI Guide',
  description: 'Consistent spacing scale for layout',
}

const SPACING_TOKENS = [
  { name: 'XS', value: '0.5rem', px: 8 },
  { name: 'SM', value: '1rem', px: 16 },
  { name: 'MD', value: '1.5rem', px: 24 },
  { name: 'LG', value: '2rem', px: 32 },
  { name: 'XL', value: '3rem', px: 48 },
]

export default function SpacingPage() {
  return (
    <UIGuideShell
      showBack
      title="Spacing System"
      description="Consistent spacing tokens used across layouts and components"
    >
      <GuideSection>
        <div className="space-y-6">
          {SPACING_TOKENS.map((token) => (
            <div key={token.name} className="flex items-center gap-6">
              <div
                className="rounded-sm bg-[#F6C531]"
                style={{ width: token.px, height: 32 }}
              />
              <div>
                <p className="font-semibold text-[#1F2E13]">{token.name}</p>
                <p className="text-sm text-[#7A6B3F]">
                  {token.value} ({token.px}px)
                </p>
              </div>
            </div>
          ))}
        </div>
      </GuideSection>
    </UIGuideShell>
  )
}
