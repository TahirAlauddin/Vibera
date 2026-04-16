import type { Metadata } from 'next'
import { Button } from '@/components/custom/button'
import { UIGuideShell } from './_components/ui-guide-shell'
import { DashboardCard } from './_components/dashboard-card'

export const metadata: Metadata = {
  title: 'Vibera UI Component Guide',
  description: 'A comprehensive design system for the mood logging journal app',
}

export default function UIGuidePage() {
  return (
    <UIGuideShell
      title="Vibera UI Component Guide"
      description="A comprehensive design system for the mood logging journal app"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Color Palette"
          description="Brand colors, accents, text, and neutrals"
          href="/ui-guide/color-palette"
          preview={
            <div className="flex gap-2">
              {['#FAF7E6', '#F6C531', '#D7E9B6', '#1F2E13'].map((color) => (
                <div
                  key={color}
                  className="size-12 rounded-md border border-[#E0E6D9]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          }
        />

        <DashboardCard
          title="Typography"
          description="Headings, titles, body, and caption styles"
          href="/ui-guide/typography"
          preview={
            <div className="text-center">
              <p className="text-2xl font-bold leading-tight">Heading</p>
              <p className="text-sm text-[#4B5A41]">Body text sample</p>
            </div>
          }
        />

        <DashboardCard
          title="Buttons"
          description="Primary, secondary, ghost, and disabled states"
          href="/ui-guide/buttons"
          preview={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button size="sm" variant="primary">
                Primary
              </Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
            </div>
          }
        />

        <DashboardCard
          title="Input Fields"
          description="Default, focused, filled, error, and disabled inputs"
          href="/ui-guide/inputs"
          preview={
            <div className="w-full max-w-[200px] rounded-md border border-black bg-[#F4F6F1] px-3 py-2 text-sm text-[#7A6B3F] shadow-sm">
              Placeholder
            </div>
          }
        />

        <DashboardCard
          title="Text Areas"
          description="Multi-line text input for journal entries"
          href="/ui-guide/text-areas"
          preview={
            <div className="h-16 w-full max-w-[200px] rounded-md border border-[#E0E6D9] bg-white p-2 text-xs text-[#7A6B3F]">
              What&apos;s on your mind...
            </div>
          }
        />

        <DashboardCard
          title="Cards"
          description="Default, elevated, and outlined card variants"
          href="/ui-guide/cards"
          preview={
            <div className="w-full max-w-[180px] rounded-lg border border-[#E0E6D9] bg-white p-3 shadow-sm">
              <p className="text-sm font-semibold">Card</p>
              <p className="text-xs text-[#7A6B3F]">Preview</p>
            </div>
          }
        />

        <DashboardCard
          title="Mood Components"
          description="Emotion selectors for mood logging"
          href="/ui-guide/mood"
          preview={
            <div className="flex gap-3 text-2xl">
              <span>😊</span>
              <span>💙</span>
              <span>😐</span>
              <span>😢</span>
            </div>
          }
        />

        <DashboardCard
          title="Spacing System"
          description="Consistent spacing scale for layout"
          href="/ui-guide/spacing"
          preview={
            <div className="flex items-end gap-2">
              {[8, 16, 24, 32].map((w) => (
                <div key={w} className="rounded-sm bg-[#F6C531]" style={{ width: w, height: 32 }} />
              ))}
            </div>
          }
        />

        <DashboardCard
          title="Border Radius"
          description="Corner radius tokens for components"
          href="/ui-guide/border-radius"
          preview={
            <div className="flex items-end gap-3">
              <div className="size-10 rounded-md bg-[#F6C531]" />
              <div className="size-10 rounded-xl bg-[#F6C531]" />
              <div className="size-10 rounded-full bg-[#F6C531]" />
            </div>
          }
        />
      </div>
    </UIGuideShell>
  )
}
