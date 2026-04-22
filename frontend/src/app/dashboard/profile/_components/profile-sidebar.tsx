'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, BookOpen, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PROFILE_MENU, RECENT_MESSAGES, SUGGESTED_FOLLOWERS } from './profile-data'

const ICONS = {
  book: BookOpen,
  chart: BarChart3,
} as const

export function ProfileSidebar() {
  const pathname = usePathname()

  return (
    <aside className="space-y-6">
      <nav className="rounded-2xl bg-white p-4 shadow-sm">
        <ul className="space-y-1">
          {PROFILE_MENU.map((item) => {
            const isActive = item.href !== '#' && pathname === item.href
            const Icon = 'icon' in item ? ICONS[item.icon] : null

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#F6C531]/20 text-[#1F2E13]'
                      : 'text-[#4B5A41] hover:bg-[#F4F6F1]'
                  )}
                >
                  {Icon && <Icon className="size-4 shrink-0" />}
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-xl border border-[#E0E6D9] bg-[#FAF7E6] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#F6C531] focus:ring-2 focus:ring-[#F6C531]/30"
          />
        </div>

        <h3 className="mb-3 text-sm font-bold text-[#1F2E13]">Recent Messages</h3>
        <ul className="max-h-48 space-y-3 overflow-y-auto">
          {RECENT_MESSAGES.map((msg) => (
            <li key={msg.id} className="flex gap-3">
              <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
                <Image src={msg.avatar} alt={msg.name} fill className="object-cover" sizes="36px" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#1F2E13]">{msg.name}</p>
                <p className="truncate text-xs text-[#7A6B3F]">{msg.message}</p>
                <p className="text-[10px] text-[#9CA3AF]">{msg.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-bold text-[#1F2E13]">Followers</h3>
        <ul className="max-h-56 space-y-3 overflow-y-auto">
          {SUGGESTED_FOLLOWERS.map((person) => (
            <li key={person.id} className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={person.avatar}
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#1F2E13]">{person.name}</p>
                  <p className="truncate text-xs text-[#7A6B3F]">{person.handle}</p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg bg-[#F6C531] px-3 py-1 text-xs font-semibold text-[#1F2E13] transition-colors hover:bg-[#E0B42D]"
              >
                Follow
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
