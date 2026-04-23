'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { getMoodLabel } from '@/lib/mood-api'
import { formatEntryDate, parseJournalReason } from './mood-tracker-utils'
import type { MoodEntry } from '@/lib/mood-api'

type MoodEntryListProps = {
  entries: MoodEntry[]
  editingId: number | null
  onEdit: (entry: MoodEntry) => void
  onDelete: (entry: MoodEntry) => void
}

export function MoodEntryList({ entries, editingId, onEdit, onDelete }: MoodEntryListProps) {
  if (entries.length === 0) {
    return (
      <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-[#1F2E13]">No journal entries yet</p>
        <p className="mt-2 text-sm text-[#7A6B3F]">
          Start your wellness journey by logging your first mood above.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-[#1F2E13]">Journal history</h2>
      <ul className="space-y-4">
        {entries.map((entry) => {
          const { intensity, journal } = parseJournalReason(entry.reason)
          const isEditing = editingId === entry.id

          return (
            <li
              key={entry.id}
              className={`rounded-xl border p-4 transition-colors ${
                isEditing
                  ? 'border-[#F6C531] bg-[#FEF9E7]'
                  : 'border-[#F4F6F1] bg-[#FAFAF8]'
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-[#F6C531]/20 text-2xl">
                    {entry.emoji}
                  </span>
                  <div>
                    <p className="font-semibold text-[#1F2E13]">{getMoodLabel(entry.emoji)}</p>
                    <p className="text-xs text-[#7A6B3F]">{formatEntryDate(entry.created_at)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(entry)}
                    className="rounded-lg p-2 text-[#4B5A41] hover:bg-[#F4F6F1]"
                    aria-label="Edit entry"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry)}
                    className="rounded-lg p-2 text-[#DC2626] hover:bg-[#FEE2E2]"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#E0E6D9] bg-white px-3 py-1 text-xs text-[#7A6B3F]">
                Intensity: <span className="font-semibold text-[#1F2E13]">{intensity}/10</span>
              </div>

              {journal ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#4B5A41]">
                  {journal}
                </p>
              ) : (
                <p className="text-sm italic text-[#9CA3AF]">No journal text for this entry.</p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
