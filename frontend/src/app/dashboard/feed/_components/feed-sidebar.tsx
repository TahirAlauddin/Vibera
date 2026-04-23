'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  Rss,
  Search,
  Settings,
  TrendingUp,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FollowButton } from '@/components/dashboard/follow-button'
import { getAvatarUrl } from '@/lib/mood-api'
import type { SuggestionUser } from '@/lib/social-api'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/mood-tracker', label: 'Mood Log', icon: BookOpen },
  { href: '/dashboard/feed', label: 'Feed', icon: Rss },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
] as const

const TRENDING_MOODS = [
  { emoji: '😊', label: 'Happy', count: 128 },
  { emoji: '😌', label: 'Calm', count: 96 },
  { emoji: '😰', label: 'Anxious', count: 54 },
  { emoji: '😔', label: 'Sad', count: 41 },
]

type FeedSidebarProps = {
  suggestions: SuggestionUser[]
  followingIds: Set<number>
  onToggleFollow: (userId: number, isFollowing: boolean) => Promise<void>
  followLoadingId: number | null
}

export function FeedSidebar({
  suggestions,
  followingIds,
  onToggleFollow,
  followLoadingId,
}: FeedSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="space-y-6">
      <nav className="hidden rounded-2xl bg-white p-4 shadow-sm xl:block">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#F6C531]/20 text-[#1F2E13]'
                      : 'text-[#4B5A41] hover:bg-[#F4F6F1]'
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#4B5A41] hover:bg-[#F4F6F1]"
            >
              <Settings className="size-4" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="search"
            placeholder="Search people..."
            className="w-full rounded-xl border border-[#E0E6D9] bg-[#FAF7E6] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#F6C531] focus:ring-2 focus:ring-[#F6C531]/30"
          />
        </div>

        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1F2E13]">
          <TrendingUp className="size-4 text-[#F6C531]" />
          Trending moods
        </h3>
        <ul className="mb-5 space-y-2">
          {TRENDING_MOODS.map((mood) => (
            <li
              key={mood.label}
              className="flex items-center justify-between rounded-xl bg-[#FAF7E6] px-3 py-2"
            >
              <span className="flex items-center gap-2 text-sm">
                <span>{mood.emoji}</span>
                <span className="font-medium text-[#4B5A41]">{mood.label}</span>
              </span>
              <span className="text-xs text-[#7A6B3F]">{mood.count}</span>
            </li>
          ))}
        </ul>

        <h3 className="mb-3 text-sm font-bold text-[#1F2E13]">People you may know</h3>
        {suggestions.length === 0 ? (
          <p className="text-xs text-[#7A6B3F]">You&apos;re connected with everyone in your network.</p>
        ) : (
          <ul className="space-y-3">
            {suggestions.slice(0, 5).map((person) => {
              const isFollowing = followingIds.has(person.id)
              return (
                <li key={person.id} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={getAvatarUrl(person.username)}
                        alt={person.username}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1F2E13]">
                        {person.first_name || person.username}
                      </p>
                      <p className="truncate text-xs text-[#7A6B3F]">@{person.username}</p>
                    </div>
                  </div>
                  <FollowButton
                    isFollowing={isFollowing}
                    loading={followLoadingId === person.id}
                    onClick={() => onToggleFollow(person.id, isFollowing)}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="hidden rounded-2xl bg-[#FEF9E7] p-4 ring-1 ring-[#F6C531]/30 lg:block">
        <div className="flex items-start gap-3">
          <BarChart3 className="mt-0.5 size-5 text-[#F6C531]" />
          <div>
            <p className="text-sm font-semibold text-[#1F2E13]">Your wellness tip</p>
            <p className="mt-1 text-xs leading-relaxed text-[#7A6B3F]">
              Logging your mood daily helps you spot patterns and celebrate small wins.
            </p>
            <Link
              href="/dashboard/mood-tracker"
              className="mt-2 inline-block text-xs font-semibold text-[#6B8F5E] hover:underline"
            >
              Log today&apos;s mood →
            </Link>
          </div>
        </div>
      </section>
    </aside>
  )
}
