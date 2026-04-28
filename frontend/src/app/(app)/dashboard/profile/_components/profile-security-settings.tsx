'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { SECURITY_SETTINGS } from './profile-data'

function SettingToggle({
  defaultOn = false,
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
        on ? 'bg-[#F6C531]' : 'bg-[#D1D5DB]'
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

export function ProfileSecuritySettings() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-[#1F2E13]">Security &amp; Settings</h2>

      <ul className="divide-y divide-[#F4F6F1]">
        {SECURITY_SETTINGS.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-[#1F2E13]">{item.title}</p>
              <p className="text-xs text-[#7A6B3F]">{item.description}</p>
            </div>
            <SettingToggle defaultOn={'defaultOn' in item ? item.defaultOn : false} label={item.title} />
          </li>
        ))}
      </ul>
    </section>
  )
}
