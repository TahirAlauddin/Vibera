'use client'

import { DAILY_REMINDERS } from './dashboard-data'
import { ToggleSwitch } from './toggle-switch'

export function DailyReminders() {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-[#1F2E13]">Daily Reminders</h2>

      <ul className="space-y-4">
        {DAILY_REMINDERS.map((reminder) => (
          <li key={reminder.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl" role="img" aria-hidden>
                {reminder.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-[#1F2E13]">{reminder.title}</p>
                <p className="text-xs text-[#7A6B3F]">{reminder.time}</p>
              </div>
            </div>
            <ToggleSwitch
              defaultOn={reminder.defaultOn}
              aria-label={`Toggle ${reminder.title}`}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
