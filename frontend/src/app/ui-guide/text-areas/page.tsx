import type { Metadata } from 'next'
import { Textarea } from '@/components/ui/textarea'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'

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
      <GuideSection title="Message">
        <div className="max-w-lg space-y-1">
          <label className="text-sm font-medium text-[#1F2E13]">Message</label>
          <Textarea
            placeholder="Type your message..."
            className="min-h-28 border-[#E0E6D9] bg-[#F9F6F0] focus-visible:border-[#B2C9AB] focus-visible:ring-[#B2C9AB]/30"
          />
        </div>
      </GuideSection>

      <GuideSection title="Note (with character count)">
        <div className="max-w-lg space-y-1">
          <label className="text-sm font-medium text-[#1F2E13]">Note</label>
          <div className="relative">
            <Textarea
              placeholder="Write a note..."
              className="min-h-32 border-2 border-[#1F2E13] bg-white focus-visible:border-[#1F2E13] focus-visible:ring-0"
            />
            <span className="absolute bottom-3 right-3 text-xs text-[#7A6B3F]">0/200</span>
          </div>
        </div>
      </GuideSection>

      <GuideSection title="With Error">
        <div className="max-w-lg space-y-1">
          <label className="text-sm font-medium text-[#1F2E13]">Description</label>
          <Textarea
            placeholder="Enter description..."
            aria-invalid="true"
            className="min-h-24 border-[#E10E11] bg-[#F4F6F1] focus-visible:border-[#E10E11] focus-visible:ring-[#E10E11]/30"
          />
          <p className="text-xs text-[#E10E11]">This field is required</p>
        </div>
      </GuideSection>
    </UIGuideShell>
  )
}
