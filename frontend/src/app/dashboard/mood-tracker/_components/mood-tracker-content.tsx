'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  createMood,
  deleteMood,
  fetchMyMoods,
  updateMood,
  type MoodEntry,
} from '@/lib/mood-api'
import { MoodJournalForm } from './mood-journal-form'
import { MoodEntryList } from './mood-entry-list'
import { MoodWeeklyOverview, MoodStatsRow } from './mood-weekly-overview'
import { getMoodStats, isSameDay } from './mood-tracker-utils'

export function MoodTrackerContent() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null)

  const loadEntries = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const data = await fetchMyMoods(accessToken)
      setEntries(data.results)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load journal entries')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    if (status === 'authenticated' && accessToken) {
      loadEntries()
    }
  }, [status, accessToken, loadEntries])

  const todayEntry = useMemo(
    () => entries.find((e) => isSameDay(e.created_at, new Date())) ?? null,
    [entries]
  )

  const stats = useMemo(() => getMoodStats(entries), [entries])

  const handleSubmit = async (emoji: string, reason: string) => {
    if (!accessToken) return

    try {
      if (editingEntry) {
        const updated = await updateMood(accessToken, editingEntry.id, { emoji, reason })
        setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
        setEditingEntry(null)
        toast.success('Journal entry updated')
      } else {
        const created = await createMood(accessToken, { emoji, reason })
        setEntries((prev) => [created, ...prev])
        toast.success('Journal entry saved')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save entry')
      throw err
    }
  }

  const handleDelete = async (entry: MoodEntry) => {
    if (!accessToken) return
    if (!window.confirm('Delete this journal entry? This cannot be undone.')) return

    try {
      await deleteMood(accessToken, entry.id)
      setEntries((prev) => prev.filter((e) => e.id !== entry.id))
      if (editingEntry?.id === entry.id) setEditingEntry(null)
      toast.success('Entry deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete entry')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#7A6B3F]">
        <Loader2 className="mr-2 size-5 animate-spin" />
        Loading your journal...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2E13] sm:text-4xl">Mood Tracker</h1>
        <p className="mt-1 text-base text-[#7A6B3F]">
          Your private journal for daily reflection and emotional awareness
        </p>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#1F2E13]">{stats.total}</p>
          <p className="text-sm text-[#7A6B3F]">Total entries</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#1F2E13]">{stats.streak}</p>
          <p className="text-sm text-[#7A6B3F]">Day streak</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#1F2E13]">{stats.avgIntensity}</p>
          <p className="text-sm text-[#7A6B3F]">Avg intensity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {todayEntry && !editingEntry && (
            <div className="rounded-xl border border-[#F6C531]/40 bg-[#FEF9E7] px-4 py-3 text-sm text-[#4B5A41]">
              You already logged today. You can{' '}
              <button
                type="button"
                onClick={() => setEditingEntry(todayEntry)}
                className="font-semibold text-[#1F2E13] underline-offset-2 hover:underline"
              >
                edit today&apos;s entry
              </button>{' '}
              or add another reflection below.
            </div>
          )}

          <MoodJournalForm
            editingEntry={editingEntry}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingEntry(null)}
          />

          <MoodEntryList
            entries={entries}
            editingId={editingEntry?.id ?? null}
            onEdit={setEditingEntry}
            onDelete={handleDelete}
          />
        </div>

        <aside className="space-y-6">
          <MoodWeeklyOverview entries={entries} />
          <MoodStatsRow entries={entries} />
        </aside>
      </div>
    </div>
  )
}
