'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PROFILE_MENU, RECENT_MESSAGES } from './profile-data'
import { ProfileFollowPanel } from './profile-follow-panel'

const ICONS = {
  book: BookOpen,
  chart: BarChart3,
} as const

type ProfileSidebarProps = {
  accessToken: string
  onStatsChange?: (stats: { followers: number; following: number }) => void
}

export function ProfileSidebar({ accessToken, onStatsChange }: ProfileSidebarProps) {
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
        <h3 className="mb-3 text-sm font-bold text-[#1F2E13]">Recent Messages</h3>
        <ul className="max-h-48 space-y-3 overflow-y-auto">
          {RECENT_MESSAGES.map((msg) => (
            <li key={msg.id} className="flex gap-3">
              <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-[#E8EDE3]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#1F2E13]">{msg.name}</p>
                <p className="truncate text-xs text-[#7A6B3F]">{msg.message}</p>
                <p className="text-[10px] text-[#9CA3AF]">{msg.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ProfileFollowPanel accessToken={accessToken} onStatsChange={onStatsChange} />
    </aside>
  )
}
