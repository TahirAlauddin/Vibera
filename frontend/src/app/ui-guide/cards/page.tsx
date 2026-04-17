import type { Metadata } from 'next'
import { UIGuideShell, GuideSection, TryItYourself } from '../_components/ui-guide-shell'
import { CardPlayground } from '../_components/card-playground'

export const metadata: Metadata = {
  title: 'Cards | Vibera UI Guide',
  description: 'Card component variants',
}

export default function CardsPage() {
  return (
    <UIGuideShell
      showBack
      title="Cards"
      description="Container components for grouping related content"
    >
      <GuideSection title="Variants (reference)">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-[#E0E6D9] bg-white p-4">
            <h4 className="mb-2 font-semibold text-[#1F2E13]">Default Card</h4>
            <p className="text-sm text-[#4B5A41]">With border and background</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <h4 className="mb-2 font-semibold text-[#1F2E13]">Elevated Card</h4>
            <p className="text-sm text-[#4B5A41]">With shadow effect</p>
          </div>
          <div className="rounded-lg border-2 border-[#1F2E13] bg-transparent p-4">
            <h4 className="mb-2 font-semibold text-[#1F2E13]">Outlined Card</h4>
            <p className="text-sm text-[#4B5A41]">Transparent with border</p>
          </div>
        </div>
      </GuideSection>

      <TryItYourself hint="Click a card to select it and see the active ring state.">
        <CardPlayground />
      </TryItYourself>
    </UIGuideShell>
  )
}
