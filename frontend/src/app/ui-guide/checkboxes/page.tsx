import type { Metadata } from 'next'
import { UIGuideShell, GuideSection, TryItYourself } from '../_components/ui-guide-shell'
import { CheckboxMatrix } from '../_components/checkbox-preview'
import { CheckboxPlayground } from '../_components/checkbox-playground'

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
      <GuideSection title="State Matrix (reference)">
        <CheckboxMatrix />
      </GuideSection>

      <TryItYourself hint="Hover, focus (Tab), and interact — terms unchecked shows error; colors match the reference matrix.">
        <CheckboxPlayground />
      </TryItYourself>
    </UIGuideShell>
  )
}
