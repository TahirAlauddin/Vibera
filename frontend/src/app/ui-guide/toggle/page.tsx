import type { Metadata } from 'next'
import { UIGuideShell, GuideSection, TryItYourself } from '../_components/ui-guide-shell'
import { ToggleMatrix } from '../_components/toggle-preview'
import { TogglePlayground } from '../_components/toggle-playground'

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
      <GuideSection title="Sizes (reference)">
        <ToggleMatrix />
      </GuideSection>

      <TryItYourself hint="Click the toggles to switch them on and off.">
        <TogglePlayground />
      </TryItYourself>
    </UIGuideShell>
  )
}
