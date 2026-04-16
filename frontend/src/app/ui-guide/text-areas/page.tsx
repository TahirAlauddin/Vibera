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
      description="Multi-line text inputs for journal entries and mood notes"
    >
      <GuideSection title="Primary TextArea">
        <div className="max-w-lg space-y-1">
          <label className="text-sm font-medium text-[#1F2E13]">Share your thoughts</label>
          <Textarea
            placeholder="What's on your mind..."
            className="min-h-24 border-[#E0E6D9] bg-[#F4F6F1] focus-visible:border-[#F6C531] focus-visible:ring-[#F6C531]/30"
          />
          <p className="text-xs text-[#7A6B3F]">Optional: Share more details about your mood</p>
        </div>
      </GuideSection>

      <GuideSection title="TextArea with Error">
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
