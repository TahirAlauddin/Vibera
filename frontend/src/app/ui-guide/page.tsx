import type { Metadata } from 'next'
import { Button } from '@/components/custom/button'
import { UIGuideShell } from './_components/ui-guide-shell'
import { DashboardCard } from './_components/dashboard-card'

export const metadata: Metadata = {
  title: 'Vibera UI Component Guide',
  description: 'A comprehensive design system for the mood logging journal app',
}

const FOUNDATION = [
  {
    title: 'Color Palette',
    description: 'Brand colors, accents, text, and neutrals',
    href: '/ui-guide/color-palette',
    preview: (
      <div className="flex gap-2">
        {['#FAF7E6', '#F6C531', '#D7E9B6', '#1F2E13'].map((color) => (
          <div
            key={color}
            className="size-12 rounded-md border border-[#E0E6D9]"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    ),
  },
  {
    title: 'Typography',
    description: 'Headings, titles, body, and caption styles',
    href: '/ui-guide/typography',
    preview: (
      <div className="text-center">
        <p className="text-2xl font-bold leading-tight">Heading</p>
        <p className="text-sm text-[#4B5A41]">Body text sample</p>
      </div>
    ),
  },
  {
    title: 'Spacing System',
    description: 'Consistent spacing scale for layout',
    href: '/ui-guide/spacing',
    preview: (
      <div className="flex items-end gap-2">
        {[8, 16, 24, 32].map((w) => (
          <div key={w} className="rounded-sm bg-[#F6C531]" style={{ width: w, height: 32 }} />
        ))}
      </div>
    ),
  },
  {
    title: 'Border Radius',
    description: 'Corner radius tokens for components',
    href: '/ui-guide/border-radius',
    preview: (
      <div className="flex items-end gap-3">
        <div className="size-10 rounded-md bg-[#F6C531]" />
        <div className="size-10 rounded-xl bg-[#F6C531]" />
        <div className="size-10 rounded-full bg-[#F6C531]" />
      </div>
    ),
  },
] as const

const FORM_COMPONENTS = [
  {
    title: 'Input Fields',
    description: 'Default, focus, error, success, and disabled states',
    href: '/ui-guide/inputs',
    preview: (
      <div className="w-full max-w-[200px] rounded-lg border border-[#E0E6D9] bg-[#F9F6F0] px-3 py-2 text-sm text-[#7A6B3F]">
        Placeholder
      </div>
    ),
  },
  {
    title: 'Text Areas',
    description: 'Message and note multi-line inputs',
    href: '/ui-guide/text-areas',
    preview: (
      <div className="h-16 w-full max-w-[200px] rounded-md border border-[#E0E6D9] bg-white p-2 text-xs text-[#7A6B3F]">
        What&apos;s on your mind...
      </div>
    ),
  },
  {
    title: 'Dropdown',
    description: 'Single and multi-select menus',
    href: '/ui-guide/dropdown',
    preview: (
      <div className="flex w-full max-w-[180px] items-center justify-between rounded-lg border border-[#E0E6D9] bg-[#F9F6F0] px-3 py-2 text-sm text-[#7A6B3F]">
        Select...
        <span className="text-xs">▼</span>
      </div>
    ),
  },
  {
    title: 'Buttons',
    description: 'Normal, outline, icon-text, and icon variants',
    href: '/ui-guide/buttons',
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="sm" variant="primary">
          Primary
        </Button>
        <span className="inline-flex size-8 items-center justify-center rounded-full border border-[#F6C531] text-[#F6C531] text-lg">
          +
        </span>
      </div>
    ),
  },
] as const

const SELECTION = [
  {
    title: 'Checkboxes',
    description: 'On/off selection with full state matrix',
    href: '/ui-guide/checkboxes',
    preview: (
      <div className="flex gap-3">
        <div className="size-5 rounded border-2 border-[#C4C4C4]" />
        <div className="flex size-5 items-center justify-center rounded border-2 border-[#F6C531] bg-[#F6C531] text-xs text-white">
          ✓
        </div>
      </div>
    ),
  },
  {
    title: 'Radio Buttons',
    description: 'Single-select option controls',
    href: '/ui-guide/radio-buttons',
    preview: (
      <div className="flex gap-3">
        <div className="flex size-5 items-center justify-center rounded-full border-2 border-[#E879A6]">
          <div className="size-2.5 rounded-full bg-[#E879A6]" />
        </div>
        <div className="size-5 rounded-full border-2 border-[#C4C4C4]" />
      </div>
    ),
  },
  {
    title: 'Toggle',
    description: 'On/off switch controls',
    href: '/ui-guide/toggle',
    preview: (
      <div className="relative h-6 w-10 rounded-full bg-[#F6C531]">
        <div className="absolute right-1 top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-sm" />
      </div>
    ),
  },
] as const

const FEEDBACK_NAV = [
  {
    title: 'Toast',
    description: 'Info, error, success, and warning notifications',
    href: '/ui-guide/toast',
    preview: (
      <div className="w-full max-w-[200px] rounded-lg border border-[#86EFAC] bg-[#F0FDF4] px-3 py-2 text-xs text-[#14532D]">
        Success notification
      </div>
    ),
  },
  {
    title: 'Pagination',
    description: 'Dots, page numbers, and compact navigation',
    href: '/ui-guide/pagination',
    preview: (
      <div className="flex items-center gap-1">
        <div className="flex size-6 items-center justify-center rounded bg-[#F6C531] text-xs font-bold">1</div>
        <div className="flex size-6 items-center justify-center text-xs text-[#7A6B3F]">2</div>
        <div className="flex size-6 items-center justify-center text-xs text-[#7A6B3F]">3</div>
      </div>
    ),
  },
] as const

const APP_SPECIFIC = [
  {
    title: 'Cards',
    description: 'Default, elevated, and outlined card variants',
    href: '/ui-guide/cards',
    preview: (
      <div className="w-full max-w-[180px] rounded-lg border border-[#E0E6D9] bg-white p-3 shadow-sm">
        <p className="text-sm font-semibold">Card</p>
        <p className="text-xs text-[#7A6B3F]">Preview</p>
      </div>
    ),
  },
  {
    title: 'Mood Components',
    description: 'Emotion selectors for mood logging',
    href: '/ui-guide/mood',
    preview: (
      <div className="flex gap-3 text-2xl">
        <span>😊</span>
        <span>💙</span>
        <span>😐</span>
        <span>😢</span>
      </div>
    ),
  },
] as const

function SectionGroup({ title, items }: { title: string; items: readonly { title: string; description: string; href: string; preview: React.ReactNode }[] }) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-[#1F2E13]">{title}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <DashboardCard key={item.href} {...item} />
        ))}
      </div>
    </section>
  )
}

export default function UIGuidePage() {
  return (
    <UIGuideShell
      title="Vibera UI Component Guide"
      description="A comprehensive design system for the mood logging journal app"
    >
      <SectionGroup title="Foundation" items={FOUNDATION} />
      <SectionGroup title="Form Components" items={FORM_COMPONENTS} />
      <SectionGroup title="Selection Controls" items={SELECTION} />
      <SectionGroup title="Feedback & Navigation" items={FEEDBACK_NAV} />
      <SectionGroup title="App Components" items={APP_SPECIFIC} />
    </UIGuideShell>
  )
}
