'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  createMood,
  fetchMoodFeed,
  getAvatarUrl,
  type FeedMood,
} from '@/lib/mood-api'
import {
  fetchFollowers,
  fetchFollowing,
  followUser,
  type UserMinimal,
} from '@/lib/social-api'
import { FeedFilters, type FeedFilter } from './feed-filters'
import { CreatePostComposer } from './create-post-composer'
import { FeedPostCard } from './feed-post-card'
import { FeedSidebar } from './feed-sidebar'

export function FeedPageContent() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const [posts, setPosts] = useState<FeedMood[]>([])
  const [filter, setFilter] = useState<FeedFilter>('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const [followingUsers, setFollowingUsers] = useState<UserMinimal[]>([])
  const [followerUsernames, setFollowerUsernames] = useState<Set<string>>(new Set())
  const [followingIds, setFollowingIds] = useState<Set<number>>(new Set())
  const [suggestions, setSuggestions] = useState<UserMinimal[]>([])
  const [followLoadingId, setFollowLoadingId] = useState<number | null>(null)

  const currentUsername = session?.user?.username
  const displayName = session?.user?.name || currentUsername || 'You'
  const avatarUrl = getAvatarUrl(currentUsername ?? 'you')

  const loadSocial = useCallback(async (token: string) => {
    const [followingRes, followersRes] = await Promise.all([
      fetchFollowing(token),
      fetchFollowers(token),
    ])

    const following = followingRes.results
      .map((r) => r.following)
      .filter((u): u is UserMinimal => Boolean(u))
    const followers = followersRes.results
      .map((r) => r.follower)
      .filter((u): u is UserMinimal => Boolean(u))

    setFollowingUsers(following)
    setFollowingIds(new Set(following.map((u) => u.id)))
    setFollowerUsernames(new Set(followers.map((u) => u.username)))

    const known = new Set([...following, ...followers].map((u) => u.id))
    setSuggestions(
      followers
        .filter((f) => !following.some((fo) => fo.id === f.id))
        .filter((f) => f.username !== currentUsername)
        .slice(0, 8)
    )
    void known
  }, [currentUsername])

  const loadFeed = useCallback(
    async (pageNum: number, append = false) => {
      if (!accessToken) return

      if (append) setLoadingMore(true)
      else setLoading(true)

      try {
        const data = await fetchMoodFeed(accessToken, pageNum, 10)
        setPosts((prev) => (append ? [...prev, ...data.results] : data.results))
        setHasMore(Boolean(data.next))
        setPage(pageNum)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load feed')
      } finally {
        setLoading(false)
        setLoadingMore(false)
        setRefreshing(false)
      }
    },
    [accessToken]
  )

  useEffect(() => {
    if (status !== 'authenticated' || !accessToken) return
    loadFeed(1)
    loadSocial(accessToken).catch(() => {})
  }, [status, accessToken, loadFeed, loadSocial])

  const mutualFriendUsernames = useMemo(() => {
    const followingNames = new Set(followingUsers.map((u) => u.username))
    return new Set([...followingNames].filter((u) => followerUsernames.has(u)))
  }, [followingUsers, followerUsernames])

  const filteredPosts = useMemo(() => {
    if (filter === 'all') return posts
    if (filter === 'following') return posts.filter((p) => p.is_following)
    return posts.filter((p) => mutualFriendUsernames.has(p.user))
  }, [posts, filter, mutualFriendUsernames])

  const handleCreatePost = async (emoji: string, reason: string) => {
    if (!accessToken) return
    const created = await createMood(accessToken, { emoji, reason })
    const enriched: FeedMood = {
      ...created,
      author_id: Number(session?.user?.id) || 0,
      is_following: false,
      user_profile: { username: currentUsername ?? '', avatar: null },
    }
    setPosts((prev) => [enriched, ...prev])
    toast.success('Mood posted!')
  }

  const handleFollowChange = (authorId: number, following: boolean) => {
    setPosts((prev) =>
      prev.map((p) => (p.author_id === authorId ? { ...p, is_following: following } : p))
    )
    setFollowingIds((prev) => {
      const next = new Set(prev)
      if (following) next.add(authorId)
      else next.delete(authorId)
      return next
    })
  }

  const handleSidebarFollow = async (userId: number) => {
    if (!accessToken) return
    setFollowLoadingId(userId)
    try {
      await followUser(accessToken, userId)
      setFollowingIds((prev) => new Set(prev).add(userId))
      setSuggestions((prev) => prev.filter((u) => u.id !== userId))
      toast.success('Followed!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not follow user')
    } finally {
      setFollowLoadingId(null)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadFeed(1)
    if (accessToken) loadSocial(accessToken).catch(() => {})
  }

  if (status === 'loading' || (loading && posts.length === 0)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#7A6B3F]">
        <Loader2 className="mr-2 size-5 animate-spin" />
        Loading your feed...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2E13] sm:text-4xl">Mood Feed</h1>
          <p className="mt-1 text-base text-[#7A6B3F]">
            Connect with others on their wellness journey
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-[#E0E6D9] bg-white px-4 py-2 text-sm font-medium text-[#4B5A41] transition-colors hover:bg-[#F4F6F1] disabled:opacity-50"
        >
          <RefreshCw className={cn('size-4', refreshing && 'animate-spin')} />
          Refresh
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="hidden xl:col-span-3 xl:block">
          <FeedSidebar
            suggestions={suggestions}
            followingIds={followingIds}
            onFollow={handleSidebarFollow}
            followLoadingId={followLoadingId}
          />
        </div>

        <div className="space-y-5 xl:col-span-6">
          <CreatePostComposer
            avatarUrl={avatarUrl}
            displayName={displayName}
            onSubmit={handleCreatePost}
          />

          <FeedFilters active={filter} onChange={setFilter} />

          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-[#1F2E13]">No posts here yet</p>
              <p className="mt-2 text-sm text-[#7A6B3F]">
                {filter === 'all'
                  ? 'Be the first to share how you are feeling today.'
                  : 'Try another filter or follow more people to see their moods.'}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredPosts.map((post) => (
                <FeedPostCard
                  key={post.id}
                  post={post}
                  accessToken={accessToken!}
                  currentUsername={currentUsername}
                  onFollowChange={handleFollowChange}
                  onCommentCountChange={() => {}}
                />
              ))}
            </div>
          )}

          {hasMore && filter === 'all' && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => loadFeed(page + 1, true)}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#1F2E13] shadow-sm ring-1 ring-[#E0E6D9] transition-colors hover:bg-[#FAF7E6] disabled:opacity-50"
              >
                {loadingMore && <Loader2 className="size-4 animate-spin" />}
                Load more posts
              </button>
            </div>
          )}
        </div>

        <div className="xl:col-span-3 xl:hidden">
          <FeedSidebar
            suggestions={suggestions}
            followingIds={followingIds}
            onFollow={handleSidebarFollow}
            followLoadingId={followLoadingId}
          />
        </div>
      </div>
    </div>
  )
}
