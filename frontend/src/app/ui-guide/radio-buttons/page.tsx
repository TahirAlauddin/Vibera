import type { Metadata } from 'next'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'
import { RadioList, RadioMatrix } from '../_components/radio-preview'

export const metadata: Metadata = {
  title: 'Radio Buttons | Vibera UI Guide',
  description: 'Radio button component states and variants',
}

export default function RadioButtonsPage() {
  return (
    <UIGuideShell
      showBack
      title="Radio Buttons"
      description="Single-select radio controls with full state matrix"
    >
      <GuideSection title="Option List">
        <RadioList />
      </GuideSection>

      <GuideSection title="State Matrix">
        <RadioMatrix />
      </GuideSection>
    </UIGuideShell>
  )
}
