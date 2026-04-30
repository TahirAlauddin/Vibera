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

export function getMoodDistribution(entries: MoodEntry[]) {
  const MOOD_COLORS: Record<string, string> = {
    Happy: '#F6C531',
    Calm: '#5B9BD5',
    Anxious: '#F59E0B',
    Sad: '#D1D5DB',
    Angry: '#EF4444',
    Tired: '#9CA3AF',
  }

  const counts: Record<string, number> = {}
  for (const entry of entries) {
    const label = getMoodLabel(entry.emoji)
    counts[label] = (counts[label] ?? 0) + 1
  }

  const total = entries.length
  if (total === 0) return []

  return Object.entries(counts)
    .map(([mood, count]) => ({
      mood,
      entries: count,
      percent: Math.round((count / total) * 100),
      color: MOOD_COLORS[mood] ?? '#6B7280',
    }))
    .sort((a, b) => b.entries - a.entries)
}

export type Achievement = {
  title: string
  icon: string
  unlocked: boolean
}

export function getAchievements(entries: MoodEntry[]): Achievement[] {
  const { streak, total } = getMoodStats(entries)

  const hasEarlyBird = entries.some((e) => new Date(e.created_at).getHours() < 10)
  const hasReflective = entries.some((e) => {
    const { journal } = parseJournalReason(e.reason)
    const hour = new Date(e.created_at).getHours()
    return journal.length > 0 && hour >= 20
  })

  return [
    { title: '7-Day Streak', icon: '🔥', unlocked: streak >= 7 },
    { title: 'Mood Master', icon: '⭐', unlocked: total >= 20 },
    { title: 'Early Bird', icon: '🌅', unlocked: hasEarlyBird },
    { title: 'Reflective', icon: '🌙', unlocked: hasReflective },
  ]
}

export function getWeeklyInsight(entries: MoodEntry[]) {
  const week = getWeeklyMoods(entries)
  const logged = week.filter((d) => d.mood)
  if (logged.length === 0) {
    return 'Start logging your mood to see weekly insights here.'
  }

  const moodCounts: Record<string, number> = {}
  for (const day of logged) {
    if (day.mood) moodCounts[day.mood] = (moodCounts[day.mood] ?? 0) + 1
  }
  const dominant = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'balanced'

  const thisWeekHappy = logged.filter((d) => d.mood === 'Happy').length
  const lastWeekHappy = entries.filter((e) => {
    const date = new Date(e.created_at)
    const daysAgo = Math.floor((Date.now() - date.getTime()) / 86400000)
    return daysAgo >= 7 && daysAgo < 14 && getMoodLabel(e.emoji) === 'Happy'
  }).length

  if (lastWeekHappy === 0) {
    return `You've been feeling mostly ${dominant.toLowerCase()} this week. Keep checking in to track your trends.`
  }

  const change = Math.round(((thisWeekHappy - lastWeekHappy) / lastWeekHappy) * 100)
  const direction = change >= 0 ? 'increased' : 'decreased'
  const absChange = Math.abs(change)

  return `You've been feeling mostly ${dominant.toLowerCase()} this week! Your positive mood ${direction} by ${absChange}% compared to last week.`
}

export { MOOD_OPTIONS, formatTimeAgo }
