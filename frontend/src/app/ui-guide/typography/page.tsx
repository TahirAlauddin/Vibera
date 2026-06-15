import type { Metadata } from 'next'
import { UIGuideShell } from '../_components/ui-guide-shell'

export const metadata: Metadata = {
  title: 'Typography | Vibera UI Guide',
  description: 'Typography scale and font styles',
}

const TYPOGRAPHY_STYLES = [
  { label: 'H1', size: '64px/140%' },
  { label: 'H1 Bold', size: '64px/140%' },
  { label: 'H2', size: '48px/140%' },
  { label: 'H2 Bold', size: '48px/140%' },
  { label: 'H3', size: '33px/140%' },
  { label: 'H3 Bold', size: '33px/140%' },
  { label: 'H4', size: '28px/140%' },
  { label: 'H4 Bold', size: '28px/140%' },
  { label: 'H5', size: '23px/140%' },
  { label: 'H5 Bold', size: '23px/140%' },
  { label: 'Title 1', size: '20px/140%' },
  { label: 'Title 1 Bold', size: '20px/140%' },
  { label: 'Title 2', size: '18px/140%' },
  { label: 'Title 2 Bold', size: '18px/140%' },
  { label: 'Body', size: '15px/140%' },
  { label: 'Body Bold', size: '15px/140%' },
  { label: 'Caption', size: '13px/140%' },
  { label: 'Caption Bold', size: '13px/140%' },
] as const

function TypographyBlock({ label, size }: { label: string; size: string }) {
  const fontSize = size.split('/')[0]
  const isBold = label.includes('Bold')

  return (
    <div className="mb-10 flex flex-col gap-4 border-b border-[#E0E6D9] pb-10 last:border-0 last:pb-0">
      <div className="flex flex-col gap-1 text-sm text-[#7A6B3F]">
        <span className="text-base font-bold text-[#1F2E13]">{label}</span>
        <span>Plus Jakarta Sans {isBold ? 'Bold' : 'Regular'}</span>
        <span>{size}</span>
      </div>

      <p
        style={{ fontSize, lineHeight: '140%' }}
        className={`text-[#1F2E13] ${isBold ? 'font-bold' : 'font-normal'}`}
      >
        The quick brown fox jumps over the lazy dog.
      </p>
    </div>
  )
}

export default function TypographyPage() {
  return (
    <UIGuideShell
      showBack
      title="Typography"
      description="Plus Jakarta Sans type scale used across the application"
    >
      <div className="rounded-xl bg-white p-8 shadow-sm">
        {TYPOGRAPHY_STYLES.map((style, index) => (
          <TypographyBlock key={index} {...style} />
        ))}
      </div>
    </UIGuideShell>
  )
}
