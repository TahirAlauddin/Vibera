import { Achievements } from './_components/achievements'
import { DailyReminders } from './_components/daily-reminders'
import { MoodDistribution } from './_components/mood-distribution'
import { QuickActions } from './_components/quick-actions'
import { StatCards } from './_components/stat-cards'
import { WeeklyMoodTracker } from './_components/weekly-mood-tracker'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2E13] sm:text-4xl">Your Dashboard</h1>
        <p className="mt-1 text-base text-[#7A6B3F]">Track your emotional wellness journey</p>
      </header>

      <div className="mb-8">
        <StatCards />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <WeeklyMoodTracker />
          <MoodDistribution />
        </div>

        <aside className="space-y-6">
          <QuickActions />
          <Achievements />
          <DailyReminders />
        </aside>
      </div>
    </div>
  )
}
