import { Lightbulb } from 'lucide-react'
import { WEEKLY_MOODS } from './dashboard-data'

export function WeeklyMoodTracker() {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-[#1F2E13]">Weekly Mood Tracker</h2>
        <button
          type="button"
          className="h-8 w-20 shrink-0 rounded-lg border border-[#E0E6D9] bg-[#F4F6F1] transition-colors hover:border-[#F6C531]/50"
          aria-label="Select week"
        />
      </div>

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="grid min-w-[520px] grid-cols-7 gap-2 sm:min-w-0 sm:gap-3">
        {WEEKLY_MOODS.map((entry) => (
          <div
            key={entry.day}
            className="flex flex-col items-center rounded-xl bg-[#F4F6F1] px-1.5 py-4 text-center sm:px-2"
          >
            <span className="mb-2 text-xs font-semibold text-[#7A6B3F]">{entry.day}</span>
            <span className="mb-2 text-3xl leading-none" role="img" aria-label={entry.mood}>
              {entry.emoji}
            </span>
            <span className="text-xs font-medium text-[#4B5A41]">{entry.mood}</span>
          </div>
        ))}
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#F6C531]/40 bg-[#FEF9E7] px-4 py-3.5">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-[#F6C531]" />
        <p className="text-sm leading-relaxed text-[#4B5A41]">
          You&apos;ve been feeling mostly <span className="font-semibold text-[#1F2E13]">happy</span>{' '}
          this week! Your positive mood increased by{' '}
          <span className="font-semibold text-[#1F2E13]">15%</span> compared to last week.
        </p>
      </div>
    </section>
  )
}
