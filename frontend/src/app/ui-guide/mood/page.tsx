import type { Metadata } from 'next'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'

export const metadata: Metadata = {
  title: 'Mood Components | Vibera UI Guide',
  description: 'Mood emotion selector components',
}

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '💙', label: 'Calm' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '🔥', label: 'Angry' },
]

export default function MoodPage() {
  return (
    <UIGuideShell
      showBack
      title="Mood Components"
      description="Emotion selectors used in mood logging flows"
    >
      <GuideSection title="Mood Emotions">
        <div className="flex flex-wrap justify-center gap-6 md:justify-between md:gap-4">
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              type="button"
              className="flex flex-col items-center rounded-xl p-4 transition-colors hover:bg-[#F4F6F1]"
            >
              <span className="mb-2 text-4xl">{mood.emoji}</span>
              <span className="text-sm font-medium text-[#4B5A41]">{mood.label}</span>
            </button>
          ))}
        </div>
      </GuideSection>

      <GuideSection title="Selected State">
        <div className="flex flex-wrap justify-center gap-6 md:justify-between md:gap-4">
          {MOODS.slice(0, 3).map((mood, i) => (
            <button
              key={mood.label}
              type="button"
              className={`flex flex-col items-center rounded-xl p-4 transition-colors ${
                i === 0 ? 'bg-[#F6C531]/30 ring-2 ring-[#F6C531]' : 'hover:bg-[#F4F6F1]'
              }`}
            >
              <span className="mb-2 text-4xl">{mood.emoji}</span>
              <span className="text-sm font-medium text-[#4B5A41]">{mood.label}</span>
            </button>
          ))}
        </div>
      </GuideSection>
    </UIGuideShell>
  )
}
