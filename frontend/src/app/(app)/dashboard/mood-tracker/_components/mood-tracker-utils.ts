import {
  formatTimeAgo,
  getMoodLabel,
  MOOD_OPTIONS,
  type MoodEntry,
} from '@/lib/mood-api'

const INTENSITY_PREFIX = /^Intensity:\s*\d{1,2}\/10\s*\n*/i

export function buildJournalReason(journal: string, intensity: number) {
  const text = journal.trim()
  const intensityLine = `Intensity: ${intensity}/10`
  return text ? `${intensityLine}\n\n${text}` : intensityLine
}

export function parseJournalReason(reason: string | null) {
  if (!reason) return { intensity: 5, journal: '' }

  const match = reason.match(/^Intensity:\s*(\d{1,2})\/10\s*\n*/i)
  if (!match) return { intensity: 5, journal: reason.trim() }

  const intensity = Math.min(10, Math.max(1, Number(match[1]) || 5))
  const journal = reason.replace(INTENSITY_PREFIX, '').trim()
  return { intensity, journal }
}

export function isSameDay(a: string, b: Date) {
  const date = new Date(a)
  return (
    date.getFullYear() === b.getFullYear() &&
    date.getMonth() === b.getMonth() &&
    date.getDate() === b.getDate()
  )
}

export function formatEntryDate(iso: string) {
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (isSameDay(iso, today)) return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
  if (isSameDay(iso, yesterday)) return `Yesterday at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function getWeeklyMoods(entries: MoodEntry[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const week: { day: string; emoji: string | null; mood: string | null; date: Date }[] = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dayEntries = entries.filter((e) => isSameDay(e.created_at, date))
    const latest = dayEntries[0]
    week.push({
      day: days[date.getDay()],
      emoji: latest?.emoji ?? null,
      mood: latest ? getMoodLabel(latest.emoji) : null,
      date,
    })
  }

  return week
}

export function getMoodStats(entries: MoodEntry[]) {
  const total = entries.length
  const streak = calculateStreak(entries)
  const intensities = entries.map((e) => parseJournalReason(e.reason).intensity)
  const avgIntensity =
    intensities.length > 0
      ? (intensities.reduce((a, b) => a + b, 0) / intensities.length).toFixed(1)
      : '—'

  return { total, streak, avgIntensity }
}

function calculateStreak(entries: MoodEntry[]) {
  if (entries.length === 0) return 0

  const uniqueDays = new Set(
    entries.map((e) => new Date(e.created_at).toDateString())
  )
  let streak = 0
  const cursor = new Date()

  while (uniqueDays.has(cursor.toDateString())) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export { MOOD_OPTIONS, formatTimeAgo }
