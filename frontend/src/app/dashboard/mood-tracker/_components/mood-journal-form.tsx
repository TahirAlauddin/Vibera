'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOOD_OPTIONS } from '@/lib/mood-api'
import { buildJournalReason, parseJournalReason } from './mood-tracker-utils'
import type { MoodEntry } from '@/lib/mood-api'

type MoodJournalFormProps = {
  editingEntry?: MoodEntry | null
  onSubmit: (emoji: string, reason: string) => Promise<void>
  onCancelEdit?: () => void
}

export function MoodJournalForm({ editingEntry, onSubmit, onCancelEdit }: MoodJournalFormProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>(MOOD_OPTIONS[0].emoji)
  const [intensity, setIntensity] = useState(7)
  const [journal, setJournal] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingEntry) {
      const parsed = parseJournalReason(editingEntry.reason)
      setSelectedEmoji(editingEntry.emoji)
      setIntensity(parsed.intensity)
      setJournal(parsed.journal)
    } else {
      setSelectedEmoji(MOOD_OPTIONS[0].emoji)
      setIntensity(7)
      setJournal('')
    }
  }, [editingEntry])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(selectedEmoji, buildJournalReason(journal, intensity))
      if (!editingEntry) {
        setJournal('')
        setIntensity(7)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#1F2E13]">
          {editingEntry ? 'Edit journal entry' : "Today's journal"}
        </h2>
        <p className="mt-1 text-sm text-[#7A6B3F]">
          {editingEntry
            ? 'Update how you felt and what was on your mind.'
            : 'Capture your mood and reflect on your day.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="mb-3 text-sm font-medium text-[#4B5A41]">How are you feeling?</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.emoji}
                type="button"
                onClick={() => setSelectedEmoji(mood.emoji)}
                className={cn(
                  'flex flex-col items-center rounded-xl px-2 py-3 transition-colors',
                  selectedEmoji === mood.emoji
                    ? 'bg-[#F6C531]/25 ring-2 ring-[#F6C531]'
                    : 'bg-[#F4F6F1] hover:bg-[#E8EBE3]'
                )}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="mt-1 text-xs font-medium text-[#4B5A41]">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="intensity" className="text-sm font-medium text-[#4B5A41]">
              Intensity
            </label>
            <span className="text-sm font-semibold text-[#1F2E13]">{intensity}/10</span>
          </div>
          <input
            id="intensity"
            type="range"
            min={1}
            max={10}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-[#F6C531]"
          />
        </div>

        <div>
          <label htmlFor="journal" className="mb-2 block text-sm font-medium text-[#4B5A41]">
            Journal entry
          </label>
          <textarea
            id="journal"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="What happened today? What triggered this feeling? Write freely..."
            rows={6}
            className="w-full resize-y rounded-xl border border-[#E0E6D9] bg-[#FAF7E6] px-4 py-3 text-sm leading-relaxed text-[#1F2E13] outline-none focus:border-[#F6C531] focus:ring-2 focus:ring-[#F6C531]/30"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F6C531] px-6 py-2.5 text-sm font-semibold text-[#1F2E13] transition-colors hover:bg-[#E0B42D] disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {editingEntry ? 'Save changes' : 'Save journal entry'}
          </button>
          {editingEntry && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-xl border border-[#E0E6D9] px-6 py-2.5 text-sm font-medium text-[#4B5A41] hover:bg-[#F4F6F1]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
