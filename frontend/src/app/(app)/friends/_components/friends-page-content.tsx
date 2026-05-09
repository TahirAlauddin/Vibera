'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2, Search, UserPlus, Users, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAvatarUrl } from '@/lib/mood-api'
import { FollowButton } from '@/components/dashboard/follow-button'
import {
  fetchFollowers,
  fetchFollowing,
  fetchFollowSuggestions,
  fetchSocialStats,
  getDisplayName,
  toggleFollow,
  userFromFollowRecord,
  type SocialStats,
  type UserMinimal,
} from '@/lib/social-api'
import { toast } from 'sonner'

type Tab = 'friends' | 'followers' | 'following' | 'discover'

type NetworkUser = UserMinimal & {
  is_following: boolean
  is_mutual?: boolean
}

const TAB_CONFIG: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'friends', label: 'Friends', icon: UserCheck },
  { id: 'followers', label: 'Followers', icon: Users },
  { id: 'following', label: 'Following', icon: UserPlus },
  { id: 'discover', label: 'Discover', icon: Search },
]

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return n.toString()
}

function parseTab(value: string | null): Tab {
  if (value === 'followers' || value === 'following' || value === 'discover' || value === 'friends') {
    return value
  }
  return 'friends'
}

export function FriendsPageContent() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const [tab, setTab] = useState<Tab>(() => parseTab(searchParams.get('tab')))
  const [search, setSearch] = useState('')
  const [followers, setFollowers] = useState<NetworkUser[]>([])
  const [following, setFollowing] = useState<NetworkUser[]>([])
  const [discover, setDiscover] = useState<NetworkUser[]>([])
  const [stats, setStats] = useState<SocialStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionUserId, setActionUserId] = useState<number | null>(null)

  useEffect(() => {
    setTab(parseTab(searchParams.get('tab')))
  }, [searchParams])

  const friends = useMemo(
    () => followers.filter((person) => person.is_mutual),
    [followers]
  )

  const loadNetwork = useCallback(async () => {
    if (!accessToken) return

    setLoading(true)
    try {
      const [followersRes, followingRes, suggestionsRes, socialStats] = await Promise.all([
        fetchFollowers(accessToken),
        fetchFollowing(accessToken),
        fetchFollowSuggestions(accessToken),
        fetchSocialStats(accessToken),
      ])

      setFollowers(followersRes.results.map((r) => userFromFollowRecord(r, 'followers')))
      setFollowing(followingRes.results.map((r) => userFromFollowRecord(r, 'following')))
      setDiscover(
        suggestionsRes.results.map((u) => ({
          ...u,
          is_following: u.is_following ?? false,
        }))
      )
      setStats(socialStats)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load your network')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    if (accessToken) {
      loadNetwork()
    }
  }, [accessToken, loadNetwork])

  const handleToggle = async (user: NetworkUser, list: Tab) => {
    if (!accessToken) return

    setActionUserId(user.id)
    try {
      const nowFollowing = await toggleFollow(accessToken, user.id, user.is_following)

      const patch = (items: NetworkUser[]) =>
        items.map((item) =>
          item.id === user.id ? { ...item, is_following: nowFollowing, is_mutual: item.is_mutual } : item
        )

      if (list === 'followers' || list === 'friends') {
        setFollowers(patch)
      } else if (list === 'following') {
        if (!nowFollowing) {
          setFollowing((prev) => prev.filter((item) => item.id !== user.id))
        } else {
          setFollowing(patch)
        }
      } else if (nowFollowing) {
        setDiscover((prev) => prev.filter((item) => item.id !== user.id))
        setFollowing((prev) => [...prev, { ...user, is_following: true }])
      } else {
        setDiscover(patch)
      }

      await loadNetwork()
      toast.success(nowFollowing ? 'Followed!' : 'Unfollowed')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update follow status')
    } finally {
      setActionUserId(null)
    }
  }

  const activeList =
    tab === 'friends'
      ? friends
      : tab === 'followers'
        ? followers
        : tab === 'following'
          ? following
          : discover

  const filteredList = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return activeList

    return activeList.filter((person) => {
      const name = getDisplayName(person).toLowerCase()
      return name.includes(query) || person.username.toLowerCase().includes(query)
    })
  }, [activeList, search])

  const tabCounts: Record<Tab, number> = {
    friends: stats?.friends_count ?? friends.length,
    followers: stats?.followers_count ?? followers.length,
    following: stats?.following_count ?? following.length,
    discover: discover.length,
  }

  const emptyMessages: Record<Tab, string> = {
    friends: 'No mutual connections yet. Follow people who follow you back to become friends.',
    followers: 'No followers yet. Share your journey to grow your community.',
    following: "You're not following anyone yet. Discover people to connect with.",
    discover: "You're connected with everyone we know about. Check back later!",
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#7A6B3F]">
        <Loader2 className="mr-2 size-5 animate-spin" />
        Loading...
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-[#4B5A41]">Sign in to view your friends and followers.</p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-xl bg-[#F6C531] px-5 py-2.5 text-sm font-semibold text-[#1F2E13] hover:bg-[#E0B42D]"
        >
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F2E13]">Friends & followers</h1>
        <p className="mt-1 text-sm text-[#7A6B3F]">
          Manage your connections, discover new people, and grow your support network.
        </p>
      </header>

      {stats && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Friends', value: stats.friends_count },
            { label: 'Followers', value: stats.followers_count },
            { label: 'Following', value: stats.following_count },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-[#E0E6D9]/60"
            >
              <p className="text-xl font-bold text-[#1F2E13]">{formatCount(item.value)}</p>
              <p className="text-xs text-[#7A6B3F]">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-[#FAF7E6] p-1">
            {TAB_CONFIG.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm',
                  tab === item.id
                    ? 'bg-white text-[#1F2E13] shadow-sm'
                    : 'text-[#7A6B3F] hover:text-[#4B5A41]'
                )}
              >
                <item.icon className="size-3.5" />
                {item.label}
                <span className="text-[10px] opacity-70">({tabCounts[item.id]})</span>
              </button>
            ))}
          </div>

          <div className="relative min-w-0 sm:w-56">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people..."
              className="w-full rounded-xl border border-[#E0E6D9] bg-[#FAF7E6] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#F6C531] focus:ring-2 focus:ring-[#F6C531]/30"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#7A6B3F]">
            <Loader2 className="mr-2 size-5 animate-spin" />
            Loading your network...
          </div>
        ) : filteredList.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#7A6B3F]">
            {search.trim() ? 'No people match your search.' : emptyMessages[tab]}
          </p>
        ) : (
          <ul className="divide-y divide-[#E0E6D9]/60">
            {filteredList.map((person) => (
              <li key={person.id} className="flex items-center justify-between gap-3 py-4 first:pt-0">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={getAvatarUrl(person.username)}
                      alt={person.username}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1F2E13]">
                      {getDisplayName(person)}
                      {person.is_mutual && (
                        <span className="ml-1.5 text-[10px] font-normal text-[#6B8F5E]">· friend</span>
                      )}
                    </p>
                    <p className="truncate text-xs text-[#7A6B3F]">@{person.username}</p>
                  </div>
                </div>
                <FollowButton
                  isFollowing={person.is_following}
                  loading={actionUserId === person.id}
                  size="md"
                  onClick={() => handleToggle(person, tab)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
