'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { fetchMyMoods, type MoodEntry } from '@/lib/mood-api'
import {
  getAchievements,
  getMoodDistribution,
  getMoodStats,
  getWeeklyInsight,
  getWeeklyMoods,
} from '../mood-tracker/_components/mood-tracker-utils'
import { Achievements } from './achievements'
import { DailyReminders } from './daily-reminders'
import { MoodDistribution } from './mood-distribution'
import { QuickActions } from './quick-actions'
import { StatCards } from './stat-cards'
import { WeeklyMoodTracker } from './weekly-mood-tracker'

export function DashboardContent() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)

  const loadEntries = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const data = await fetchMyMoods(accessToken)
      setEntries(data.results ?? [])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load journal entries')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    if (status === 'loading') return
    if (status !== 'authenticated' || !accessToken) {
      setLoading(false)
      return
    }
    loadEntries()
  }, [status, accessToken, loadEntries])

  const stats = useMemo(() => getMoodStats(entries), [entries])
  const weeklyMoods = useMemo(() => getWeeklyMoods(entries), [entries])
  const moodDistribution = useMemo(() => getMoodDistribution(entries), [entries])
  const achievements = useMemo(() => getAchievements(entries), [entries])
  const weeklyInsight = useMemo(() => getWeeklyInsight(entries), [entries])

  const exportData = useMemo(
    () => ({
      stats: {
        totalEntries: stats.total,
        dayStreak: stats.streak,
        avgIntensity: stats.avgIntensity,
      },
      weeklyMoods,
      moodDistribution,
      exportedAt: new Date().toISOString(),
    }),
    [stats, weeklyMoods, moodDistribution]
  )

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#F6C531]" />
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <StatCards stats={stats} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <WeeklyMoodTracker week={weeklyMoods} insight={weeklyInsight} />
          <MoodDistribution distribution={moodDistribution} />
        </div>

        <aside className="space-y-6">
          <QuickActions exportData={exportData} />
          <Achievements achievements={achievements} />
          <DailyReminders />
        </aside>
      </div>
    </>
  )
}
