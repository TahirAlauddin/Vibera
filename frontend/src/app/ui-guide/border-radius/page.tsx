import type { Metadata } from 'next'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'

export const metadata: Metadata = {
  title: 'Border Radius | Vibera UI Guide',
  description: 'Corner radius tokens for components',
}

const RADIUS_TOKENS = [
  { name: 'SM', value: '0.5rem' },
  { name: 'MD', value: '0.75rem' },
  { name: 'LG', value: '1rem' },
  { name: 'Full', value: '9999px', isCircle: true },
]

export default function BorderRadiusPage() {
  return (
    <UIGuideShell
      showBack
      title="Border Radius"
      description="Corner radius tokens applied to buttons, cards, and inputs"
    >
      <GuideSection>
        <div className="flex flex-wrap items-end justify-center gap-8 md:justify-start">
          {RADIUS_TOKENS.map((token) => (
            <div key={token.name} className="flex flex-col items-center">
              <div
                className="mb-3 bg-[#F6C531]"
                style={{
                  width: token.isCircle ? 96 : 120,
                  height: 96,
                  borderRadius: token.isCircle ? '9999px' : token.value,
                }}
              />
              <span className="text-sm font-semibold text-[#1F2E13]">{token.name}</span>
              <span className="text-xs text-[#7A6B3F]">{token.value}</span>
            </div>
          ))}
        </div>
      </GuideSection>
    </UIGuideShell>
  )
}
