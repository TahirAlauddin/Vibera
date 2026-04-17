import type { Metadata } from 'next'
import { UIGuideShell, GuideSection, TryItYourself } from '../_components/ui-guide-shell'
import { MoodPlayground } from '../_components/mood-playground'

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '💙', label: 'Calm' },
  { emoji: '😐', label: 'Neutral' },
]

export const metadata: Metadata = {
  title: 'Mood Components | Vibera UI Guide',
  description: 'Mood emotion selector components',
}

export default function MoodPage() {
  return (
    <UIGuideShell
      showBack
      title="Mood Components"
      description="Emotion selectors used in mood logging flows"
    >
      <GuideSection title="Default & selected states (reference)">
        <div className="flex flex-wrap justify-center gap-6 md:justify-start">
          {MOODS.map((mood, i) => (
            <div
              key={mood.label}
              className={`flex flex-col items-center rounded-xl p-4 ${
                i === 0 ? 'bg-[#F6C531]/30 ring-2 ring-[#F6C531]' : 'bg-[#F4F6F1]'
              }`}
            >
              <span className="mb-2 text-4xl">{mood.emoji}</span>
              <span className="text-sm font-medium text-[#4B5A41]">{mood.label}</span>
            </div>
          ))}
        </div>
      </GuideSection>

      <TryItYourself hint="Tap a mood emoji to select how you're feeling.">
        <MoodPlayground />
      </TryItYourself>
    </UIGuideShell>
  )
}
