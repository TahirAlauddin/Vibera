'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, Users } from 'lucide-react'
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
  type UserMinimal,
} from '@/lib/social-api'
import { toast } from 'sonner'

type Tab = 'followers' | 'following' | 'discover'

type NetworkUser = UserMinimal & {
  is_following: boolean
  is_mutual?: boolean
}

type ProfileFollowPanelProps = {
  accessToken: string
  onStatsChange?: (stats: {
    followers: number
    following: number
    friends: number
  }) => void
}

export function ProfileFollowPanel({ accessToken, onStatsChange }: ProfileFollowPanelProps) {
  const [tab, setTab] = useState<Tab>('followers')
  const [followers, setFollowers] = useState<NetworkUser[]>([])
  const [following, setFollowing] = useState<NetworkUser[]>([])
  const [discover, setDiscover] = useState<NetworkUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionUserId, setActionUserId] = useState<number | null>(null)

  const loadNetwork = useCallback(async () => {
    setLoading(true)
    try {
      const [followersRes, followingRes, suggestionsRes, socialStats] = await Promise.all([
        fetchFollowers(accessToken),
        fetchFollowing(accessToken),
        fetchFollowSuggestions(accessToken),
        fetchSocialStats(accessToken),
      ])

      const nextFollowers = followersRes.results.map((r) => userFromFollowRecord(r, 'followers'))
      const nextFollowing = followingRes.results.map((r) => userFromFollowRecord(r, 'following'))
      const nextDiscover = suggestionsRes.results.map((u) => ({
        ...u,
        is_following: u.is_following ?? false,
      }))

      setFollowers(nextFollowers)
      setFollowing(nextFollowing)
      setDiscover(nextDiscover)
      onStatsChange?.({
        followers: socialStats.followers_count,
        following: socialStats.following_count,
        friends: socialStats.friends_count,
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load network')
    } finally {
      setLoading(false)
    }
  }, [accessToken, onStatsChange])

  useEffect(() => {
    loadNetwork()
  }, [loadNetwork])

  const handleToggle = async (user: NetworkUser, list: Tab) => {
    setActionUserId(user.id)
    try {
      const nowFollowing = await toggleFollow(accessToken, user.id, user.is_following)

      const patch = (items: NetworkUser[]) =>
        items.map((item) =>
          item.id === user.id ? { ...item, is_following: nowFollowing } : item
        )

      if (list === 'followers') {
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
    tab === 'followers' ? followers : tab === 'following' ? following : discover

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'followers', label: 'Followers', count: followers.length },
    { id: 'following', label: 'Following', count: following.length },
    { id: 'discover', label: 'Discover', count: discover.length },
  ]

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-[#F6C531]" />
          <h3 className="text-sm font-bold text-[#1F2E13]">Your network</h3>
        </div>
        <Link
          href="/friends"
          className="text-xs font-semibold text-[#6B8F5E] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="mb-4 flex gap-1 rounded-xl bg-[#FAF7E6] p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              'flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors',
              tab === item.id
                ? 'bg-white text-[#1F2E13] shadow-sm'
                : 'text-[#7A6B3F] hover:text-[#4B5A41]'
            )}
          >
            {item.label}
            <span className="ml-1 text-[10px] opacity-70">({item.count})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-[#7A6B3F]">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Loading...
        </div>
      ) : activeList.length === 0 ? (
        <p className="py-6 text-center text-xs text-[#7A6B3F]">
          {tab === 'followers' && 'No followers yet. Share your journey to grow your community.'}
          {tab === 'following' && "You're not following anyone yet. Discover people below."}
          {tab === 'discover' && "You're connected with everyone we know about. Check back later!"}
        </p>
      ) : (
        <ul className="max-h-72 space-y-3 overflow-y-auto">
          {activeList.map((person) => (
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
                    {getDisplayName(person)}
                    {person.is_mutual && (
                      <span className="ml-1 text-[10px] font-normal text-[#6B8F5E]">· mutual</span>
                    )}
                  </p>
                  <p className="truncate text-xs text-[#7A6B3F]">@{person.username}</p>
                </div>
              </div>
              <FollowButton
                isFollowing={person.is_following}
                loading={actionUserId === person.id}
                onClick={() => handleToggle(person, tab)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
