import type { Metadata } from 'next'
import { UIGuideShell, GuideSection, TryItYourself } from '../_components/ui-guide-shell'
import { DropdownPreview } from '../_components/dropdown-preview'
import { DropdownPlayground } from '../_components/dropdown-playground'

export const metadata: Metadata = {
  title: 'Dropdown | Vibera UI Guide',
  description: 'Dropdown and select menu components',
}

export default function DropdownPage() {
  return (
    <UIGuideShell
      showBack
      title="Dropdown"
      description="Select menus with single and multi-select support"
    >
      <GuideSection title="States (reference)">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium text-[#7A6B3F]">Closed</p>
            <DropdownPreview />
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-[#7A6B3F]">Open (with selection)</p>
            <DropdownPreview defaultOpen />
          </div>
        </div>
      </GuideSection>

      <TryItYourself hint="Open the menus, pick options, and remove multi-select tags.">
        <DropdownPlayground />
      </TryItYourself>
    </UIGuideShell>
  )
}
