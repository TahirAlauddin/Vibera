'use client'

import { Bell } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

function ReminderToggle({
  defaultOn = true,
  label,
}: {
  defaultOn?: boolean
  label: string
}) {
  const [on, setOn] = useState(defaultOn)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => setOn((v) => !v)}
      className={cn(
        'relative h-6 w-10 shrink-0 rounded-full transition-colors',
        on ? 'bg-[#91B6A2]' : 'bg-[#D1D5DB]'
      )}
    >
      <span
        className={cn(
          'absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all',
          on ? 'right-1' : 'left-1'
        )}
      />
    </button>
  )
}

const REMINDERS = [
  { icon: '☀️', label: 'Morning Check-in', time: '9:00 AM', defaultOn: true },
  { icon: '🌙', label: 'Evening Reflection', time: '8:00 PM', defaultOn: true },
]

export function NeverMissDaySection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2
            className="text-3xl font-bold text-[#423E28] sm:text-4xl"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Never Miss A Day
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#9CA3AF]">
            Set gentle reminders to check in with yourself. Build a consistent journaling habit
            that supports your emotional wellness journey, one day at a time.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="mb-5 flex items-center gap-2">
              <Bell className="size-5 text-[#F6C531]" />
              <h3 className="text-base font-semibold text-[#423E28]">Daily Reminders</h3>
            </div>
            <ul className="space-y-3">
              {REMINDERS.map((reminder) => (
                <li
                  key={reminder.label}
                  className="flex items-center justify-between rounded-xl bg-[#F4F6F1] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg" role="img" aria-hidden>
                      {reminder.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#423E28]">{reminder.label}</p>
                      <p className="text-xs text-[#9CA3AF]">{reminder.time}</p>
                    </div>
                  </div>
                  <ReminderToggle
                    defaultOn={reminder.defaultOn}
                    label={`Toggle ${reminder.label}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
