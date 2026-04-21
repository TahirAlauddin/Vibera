'use client'

import Link from 'next/link'
import { EXPORT_DATA } from './dashboard-data'

export function QuickActions() {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(EXPORT_DATA, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'vibera-mood-data.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-[#1F2E13]">Quick Actions</h2>

      <div className="flex flex-col gap-3">
        <Link
          href="/ui-guide/mood"
          className="flex h-11 items-center justify-center rounded-lg bg-[#F6C531] text-sm font-semibold text-[#1F2E13] transition-colors hover:bg-[#E0B42D]"
        >
          Log Today&apos;s Mood
        </Link>
        <button
          type="button"
          className="flex h-11 items-center justify-center rounded-lg bg-[#F4F6F1] text-sm font-semibold text-[#1F2E13] transition-colors hover:bg-[#E8EBE3]"
        >
          View History
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="py-2 text-sm font-medium text-[#4B5A41] transition-colors hover:text-[#1F2E13]"
        >
          Export Data
        </button>
      </div>
    </section>
  )
}
