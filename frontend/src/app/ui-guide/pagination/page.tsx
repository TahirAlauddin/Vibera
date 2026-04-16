import type { Metadata } from 'next'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'
import {
  PaginationCompact,
  PaginationDots,
  PaginationPages,
  PaginationWithJump,
} from '../_components/pagination-preview'

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
      <GuideSection title="Dot Pagination">
        <PaginationDots active={1} />
      </GuideSection>

      <GuideSection title="Page Numbers">
        <PaginationPages current={1} />
      </GuideSection>

      <GuideSection title="Compact">
        <PaginationCompact />
      </GuideSection>

      <GuideSection title="With Jump">
        <PaginationWithJump />
      </GuideSection>

      <GuideSection title="Rows per page">
        <div className="flex items-center gap-3 text-sm text-[#4B5A41]">
          <span>Rows per page</span>
          <select className="h-9 rounded-lg border border-[#E0E6D9] bg-[#F9F6F0] px-3 text-sm">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </GuideSection>
    </UIGuideShell>
  )
}
