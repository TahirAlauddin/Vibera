import type { Metadata } from 'next'
import { UIGuideShell, GuideSection, TryItYourself } from '../_components/ui-guide-shell'
import { RadioMatrix } from '../_components/radio-preview'
import { RadioPlayground } from '../_components/radio-playground'

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
      <GuideSection title="State Matrix (reference)">
        <RadioMatrix />
      </GuideSection>

      <TryItYourself hint="Select an option — hover shows blue border, Tab shows pink focus ring, unselected shows error.">
        <RadioPlayground />
      </TryItYourself>
    </UIGuideShell>
  )
}
