import type { Metadata } from 'next'
import { InputBox } from '@/components/custom/inputBox'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'

export const metadata: Metadata = {
  title: 'Input Fields | Vibera UI Guide',
  description: 'Input field variants and states',
}

function InputRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[120px_1fr_1fr]">
      <p className="pt-3 text-sm font-medium text-[#4B5A41]">{label}</p>
      {children}
    </div>
  )
}

export default function InputsPage() {
  return (
    <UIGuideShell
      showBack
      title="Input Fields"
      description="Primary and accent input variants across interaction states"
    >
      <GuideSection title="Primary">
        <div className="mb-4 hidden gap-16 md:grid md:grid-cols-[120px_1fr_1fr]">
          <div />
          <p className="text-sm font-medium text-[#1F2E13]">Label</p>
          <p className="text-sm font-medium text-[#1F2E13]">Search</p>
        </div>

        <div className="space-y-8">
          <InputRow label="default">
            <div className="space-y-1">
              <InputBox placeholder="PlaceHolder" containerClassName="w-full max-w-[394px]" />
              <p className="text-xs text-[#7A6B3F]">this is information text</p>
            </div>
            <InputBox
              variant="accent"
              placeholder="PlaceHolder"
              containerClassName="border-black w-full max-w-[394px]"
            />
          </InputRow>

          <InputRow label="focused">
            <div className="space-y-1">
              <InputBox state="focused" placeholder="PlaceHolder" containerClassName="w-full max-w-[394px]" />
              <p className="text-xs text-[#7A6B3F]">this is information text</p>
            </div>
            <InputBox
              variant="accent"
              state="focused"
              placeholder="PlaceHolder"
              containerClassName="border-black w-full max-w-[394px]"
            />
          </InputRow>

          <InputRow label="filled">
            <div className="space-y-1">
              <InputBox state="filled" defaultValue="PlaceHolder" containerClassName="w-full max-w-[394px]" />
              <p className="text-xs text-[#7A6B3F]">this is information text</p>
            </div>
            <InputBox
              variant="accent"
              state="filled"
              defaultValue="PlaceHolder"
              containerClassName="border-black w-full max-w-[394px]"
            />
          </InputRow>

          <InputRow label="error">
            <div className="space-y-1">
              <InputBox state="error" placeholder="PlaceHolder" containerClassName="w-full max-w-[394px]" />
              <p className="text-xs text-[#E10E11]">This is an error message</p>
            </div>
            <InputBox variant="accent" state="error" placeholder="PlaceHolder" containerClassName="w-full max-w-[394px]" />
          </InputRow>

          <InputRow label="disabled">
            <div className="space-y-1">
              <InputBox state="disabled" placeholder="PlaceHolder" containerClassName="w-full max-w-[394px]" />
              <p className="text-xs text-[#7A6B3F]">this is information text</p>
            </div>
            <InputBox variant="accent" state="disabled" placeholder="PlaceHolder" containerClassName="w-full max-w-[394px]" />
          </InputRow>
        </div>
      </GuideSection>

      <GuideSection title="Secondary (Green Accent)">
        <div className="space-y-8">
          <InputRow label="default">
            <InputBox
              variant="secondary-accent"
              placeholder="PlaceHolder"
              containerClassName="w-full max-w-[394px]"
            />
            <div />
          </InputRow>
          <InputRow label="filled">
            <InputBox
              variant="secondary-accent"
              state="filled"
              defaultValue="Filled value"
              containerClassName="w-full max-w-[394px]"
            />
            <div />
          </InputRow>
        </div>
      </GuideSection>
    </UIGuideShell>
  )
}
