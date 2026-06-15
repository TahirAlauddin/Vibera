import type { Metadata } from 'next'
import { Textarea } from '@/components/ui/textarea'
import { UIGuideShell, GuideSection, TryItYourself } from '../_components/ui-guide-shell'
import { TextAreaPlayground } from '../_components/form-playground'

export const metadata: Metadata = {
  title: 'Text Areas | Vibera UI Guide',
  description: 'Multi-line text input components',
}

export default function TextAreasPage() {
  return (
    <UIGuideShell
      showBack
      title="Text Areas"
      description="Message and note text areas for journal entries"
    >
      <GuideSection title="Variants (reference)">
        <div className="grid max-w-lg gap-8">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1F2E13]">Message</label>
            <Textarea
              placeholder="Type your message..."
              readOnly
              className="min-h-28 border-[#E0E6D9] bg-[#F9F6F0]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1F2E13]">Note (with character count)</label>
            <div className="relative">
              <Textarea
                placeholder="Write a note..."
                readOnly
                className="min-h-32 border-2 border-[#1F2E13] bg-white"
              />
              <span className="absolute bottom-3 right-3 text-xs text-[#7A6B3F]">0/200</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1F2E13]">With error</label>
            <Textarea
              placeholder="Enter description..."
              readOnly
              aria-invalid="true"
              className="min-h-24 border-[#E10E11] bg-[#F4F6F1]"
            />
            <p className="text-xs text-[#E10E11]">This field is required</p>
          </div>
        </div>
      </GuideSection>

      <TryItYourself hint="Type in the fields — the note area updates its character count as you write.">
        <TextAreaPlayground />
      </TryItYourself>
    </UIGuideShell>
  )
}
