import type { Metadata } from 'next'
import { UIGuideShell, GuideSection, TryItYourself } from '../_components/ui-guide-shell'
import { ButtonStateGrid } from '../_components/button-preview'
import { ButtonPlayground } from '../_components/button-playground'

export const metadata: Metadata = {
  title: 'Buttons | Vibera UI Guide',
  description: 'Button component variants and states',
}

export default function ButtonsPage() {
  return (
    <UIGuideShell
      showBack
      title="Buttons"
      description="Normal, outline, icon-text, and icon button variants across sizes and states"
    >
      <GuideSection>
        <ButtonStateGrid variant="normal" title="Normal (Solid)" />
      </GuideSection>

      <GuideSection>
        <ButtonStateGrid variant="outline" title="Outline" />
      </GuideSection>

      <GuideSection>
        <ButtonStateGrid variant="icon-text" title="Icon + Text" />
      </GuideSection>

      <GuideSection>
        <ButtonStateGrid variant="icon" title="Icon Only" />
      </GuideSection>

      <TryItYourself hint="Click, hover, and press the buttons to feel their real interaction states.">
        <ButtonPlayground />
      </TryItYourself>
    </UIGuideShell>
  )
}
