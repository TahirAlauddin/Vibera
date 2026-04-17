'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '💙', label: 'Calm' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '🔥', label: 'Angry' },
]

export function MoodPlayground() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-4 md:justify-start">
        {MOODS.map((mood) => (
          <button
            key={mood.label}
            type="button"
            onClick={() => setSelected(mood.label)}
            className={cn(
              'flex flex-col items-center rounded-xl p-4 transition-colors',
              selected === mood.label
                ? 'bg-[#F6C531]/30 ring-2 ring-[#F6C531]'
                : 'hover:bg-[#F4F6F1]'
            )}
          >
            <span className="mb-2 text-4xl">{mood.emoji}</span>
            <span className="text-sm font-medium text-[#4B5A41]">{mood.label}</span>
          </button>
        ))}
      </div>

      <p className="border-t border-[#E0E6D9] pt-4 text-sm text-[#7A6B3F]">
        {selected ? (
          <>
            You selected:{' '}
            <span className="font-medium text-[#1F2E13]">
              {MOODS.find((m) => m.label === selected)?.emoji} {selected}
            </span>
          </>
        ) : (
          'Tap a mood to select it.'
        )}
      </p>
    </div>
  )
}
