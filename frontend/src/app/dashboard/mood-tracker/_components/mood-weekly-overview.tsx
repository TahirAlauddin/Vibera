import { getMoodLabel } from '@/lib/mood-api'
import { getWeeklyMoods } from './mood-tracker-utils'
import type { MoodEntry } from '@/lib/mood-api'

type MoodWeeklyOverviewProps = {
  entries: MoodEntry[]
}

export function MoodWeeklyOverview({ entries }: MoodWeeklyOverviewProps) {
  const week = getWeeklyMoods(entries)

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-[#1F2E13]">This week</h2>
      <div className="grid grid-cols-7 gap-2">
        {week.map((day) => (
          <div
            key={day.day + day.date.toISOString()}
            className="flex flex-col items-center rounded-xl bg-[#F4F6F1] px-1 py-3 text-center"
          >
            <span className="mb-2 text-[10px] font-semibold text-[#7A6B3F] sm:text-xs">
              {day.day}
            </span>
            {day.emoji ? (
              <>
                <span className="text-xl sm:text-2xl">{day.emoji}</span>
                <span className="mt-1 hidden text-[10px] font-medium text-[#4B5A41] sm:block">
                  {day.mood}
                </span>
              </>
            ) : (
              <span className="text-lg text-[#D1D5DB]">·</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export function MoodStatsRow({ entries }: MoodWeeklyOverviewProps) {
  const week = getWeeklyMoods(entries)
  const loggedDays = week.filter((d) => d.emoji).length

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard label="Entries this week" value={String(loggedDays)} />
      <StatCard
        label="Most recent"
        value={entries[0] ? getMoodLabel(entries[0].emoji) : '—'}
      />
      <StatCard
        label="Latest intensity"
        value={
          entries[0]
            ? `${parseIntensity(entries[0].reason)}/10`
            : '—'
        }
      />
    </div>
  )
}

function parseIntensity(reason: string | null) {
  const match = reason?.match(/^Intensity:\s*(\d{1,2})\/10/i)
  return match ? match[1] : '—'
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#FEF9E7] p-4 ring-1 ring-[#F6C531]/20">
      <p className="text-2xl font-bold text-[#1F2E13]">{value}</p>
      <p className="text-sm text-[#7A6B3F]">{label}</p>
    </div>
  )
}
