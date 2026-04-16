import type { Metadata } from 'next'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'
import { DropdownPreview, MultiSelectPreview } from '../_components/dropdown-preview'

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
      <GuideSection title="Default Dropdown">
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

      <GuideSection title="Multi-select">
        <MultiSelectPreview />
      </GuideSection>

      <GuideSection title="With Label">
        <div className="max-w-xs space-y-1">
          <label className="text-sm font-medium text-[#1F2E13]">Category</label>
          <DropdownPreview placeholder="Choose an option" />
          <p className="text-xs text-[#7A6B3F]">Select a category from the list</p>
        </div>
      </GuideSection>
    </UIGuideShell>
  )
}
