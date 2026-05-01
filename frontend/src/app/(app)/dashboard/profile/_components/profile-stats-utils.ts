import { formatTimeAgo, getMoodLabel, type MoodEntry } from '@/lib/mood-api'
import type { SocialStats } from '@/lib/social-api'
import { parseJournalReason } from '../../mood-tracker/_components/mood-tracker-utils'

export type ProfileStat = {
  title: string
  value: string
  change: string | null
  note: string
}

export type RecentActivity = {
  id: number
  title: string
  message: string
  time: string
  emoji: string
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return n.toString()
}

function countInMonth(entries: MoodEntry[], year: number, month: number) {
  return entries.filter((entry) => {
    const date = new Date(entry.created_at)
    return date.getFullYear() === year && date.getMonth() === month
  }).length
}

function formatMonthChange(current: number, previous: number): { change: string; note: string } {
  if (previous === 0) {
    if (current === 0) return { change: '—', note: 'no entries yet' }
    return { change: 'New', note: 'this month' }
  }

  const pct = ((current - previous) / previous) * 100
  const sign = pct >= 0 ? '+' : ''
  return { change: `${sign}${pct.toFixed(1)}%`, note: 'from last month' }
}

export function getProfileStats(moods: MoodEntry[], social: SocialStats): ProfileStat[] {
  const now = new Date()
  const thisMonth = countInMonth(moods, now.getFullYear(), now.getMonth())
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonth = countInMonth(
    moods,
    lastMonthDate.getFullYear(),
    lastMonthDate.getMonth()
  )

  const totalComments = moods.reduce((sum, mood) => sum + (mood.comment_count ?? 0), 0)
  const engagementRate =
    moods.length > 0 ? Math.min(100, Math.round((totalComments / moods.length) * 100)) : 0

  const moodTrend = formatMonthChange(thisMonth, lastMonth)

  return [
    {
      title: 'Mood Entries',
      value: formatCount(moods.length),
      change: moodTrend.change,
      note: moodTrend.note,
    },
    {
      title: 'Total Followers',
      value: formatCount(social.followers_count),
      change: null,
      note: `${social.friends_count} mutual`,
    },
    {
      title: 'Total Following',
      value: formatCount(social.following_count),
      change: null,
      note: 'people you follow',
    },
    {
      title: 'Engagement Rate',
      value: `${engagementRate}%`,
      change: totalComments > 0 ? `${totalComments} comments` : null,
      note: 'on your mood posts',
    },
  ]
}

export function getRecentActivity(entries: MoodEntry[], limit = 3): RecentActivity[] {
  return entries.slice(0, limit).map((entry) => {
    const { journal } = parseJournalReason(entry.reason)
    const moodLabel = getMoodLabel(entry.emoji)
    const preview = journal
      ? journal.length > 60
        ? `${journal.slice(0, 60)}…`
        : journal
      : `Logged feeling ${moodLabel.toLowerCase()}`

    return {
      id: entry.id,
      title: moodLabel,
      message: preview,
      time: formatTimeAgo(entry.created_at),
      emoji: entry.emoji,
    }
  })
}
