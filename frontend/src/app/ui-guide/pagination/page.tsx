import type { Metadata } from 'next'
import { UIGuideShell, GuideSection, TryItYourself } from '../_components/ui-guide-shell'
import {
  PaginationCompact,
  PaginationDots,
  PaginationPages,
  PaginationWithJump,
} from '../_components/pagination-preview'
import { PaginationPlayground } from '../_components/pagination-playground'

export const metadata: Metadata = {
  title: 'Pagination | Vibera UI Guide',
  description: 'Pagination navigation components',
}

export default function PaginationPage() {
  return (
    <UIGuideShell
      showBack
      title="Pagination"
      description="Page navigation with dots, numbers, and compact variants"
    >
      <GuideSection title="Variants (reference)">
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-sm font-medium text-[#7A6B3F]">Dot pagination</p>
            <PaginationDots active={1} />
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-[#7A6B3F]">Page numbers</p>
            <PaginationPages current={1} />
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-[#7A6B3F]">Compact</p>
            <PaginationCompact />
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-[#7A6B3F]">With jump</p>
            <PaginationWithJump />
          </div>
        </div>
      </GuideSection>

      <TryItYourself hint="Navigate pages, click dots, jump to a page, or change rows per page.">
        <PaginationPlayground />
      </TryItYourself>
    </UIGuideShell>
  )
}
