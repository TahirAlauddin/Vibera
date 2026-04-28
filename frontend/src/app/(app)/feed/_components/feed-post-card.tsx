'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  UserPlus,
  UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  formatTimeAgo,
  getAvatarUrl,
  getMoodLabel,
  pseudoIntensity,
  type FeedMood,
} from '@/lib/mood-api'
import { followUser, unfollowUser } from '@/lib/social-api'
import { toast } from 'sonner'
import { FeedComments } from './feed-comments'

const LIKES_KEY = 'vibera-feed-likes'

function readLikes(): Set<number> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(LIKES_KEY)
    return new Set(raw ? (JSON.parse(raw) as number[]) : [])
  } catch {
    return new Set()
  }
}

function writeLikes(likes: Set<number>) {
  localStorage.setItem(LIKES_KEY, JSON.stringify([...likes]))
}

function displayNameFromUsername(username: string) {
  return username
    .split(/[._-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

type FeedPostCardProps = {
  post: FeedMood
  accessToken: string
  currentUsername?: string
  onFollowChange: (authorId: number, following: boolean) => void
  onCommentCountChange: (moodId: number, delta: number) => void
}

export function FeedPostCard({
  post,
  accessToken,
  currentUsername,
  onFollowChange,
  onCommentCountChange,
}: FeedPostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(() => (post.id % 12) + 3)
  const [showComments, setShowComments] = useState(false)
  const [commentCount, setCommentCount] = useState(post.comment_count)
  const [isFollowing, setIsFollowing] = useState(post.is_following)
  const [followLoading, setFollowLoading] = useState(false)

  const isOwnPost = currentUsername === post.user
  const displayName = displayNameFromUsername(post.user)
  const avatarUrl = getAvatarUrl(post.user, post.user_profile?.avatar)
  const moodLabel = getMoodLabel(post.emoji)
  const intensity = pseudoIntensity(post.id)

  useEffect(() => {
    setLiked(readLikes().has(post.id))
  }, [post.id])

  const toggleLike = () => {
    const likes = readLikes()
    if (liked) {
      likes.delete(post.id)
      setLikeCount((c) => Math.max(0, c - 1))
    } else {
      likes.add(post.id)
      setLikeCount((c) => c + 1)
    }
    writeLikes(likes)
    setLiked(!liked)
  }

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/feed#post-${post.id}`
    const text = `${post.user} shared a ${moodLabel} mood on Vibera`
    if (navigator.share) {
      await navigator.share({ title: 'Vibera Mood', text, url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }, [post.id, post.user, moodLabel])

  const handleFollow = async () => {
    setFollowLoading(true)
    try {
      if (isFollowing) {
        await unfollowUser(accessToken, post.author_id)
        setIsFollowing(false)
        onFollowChange(post.author_id, false)
        toast.success('Unfollowed')
      } else {
        await followUser(accessToken, post.author_id)
        setIsFollowing(true)
        onFollowChange(post.author_id, true)
        toast.success('Followed!')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update follow status')
    } finally {
      setFollowLoading(false)
    }
  }

  return (
    <article id={`post-${post.id}`} className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-[#F6C531]/30">
              <Image src={avatarUrl} alt={displayName} fill className="object-cover" sizes="44px" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-[#1F2E13]">{displayName}</p>
              <p className="text-xs text-[#7A6B3F]">
                @{post.user} · {formatTimeAgo(post.created_at)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {!isOwnPost && (
              <button
                type="button"
                onClick={handleFollow}
                disabled={followLoading}
                className={cn(
                  'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
                  isFollowing
                    ? 'bg-[#F4F6F1] text-[#4B5A41]'
                    : 'bg-[#F6C531] text-[#1F2E13] hover:bg-[#E0B42D]'
                )}
              >
                {isFollowing ? (
                  <UserCheck className="size-3.5" />
                ) : (
                  <UserPlus className="size-3.5" />
                )}
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
            <button
              type="button"
              className="rounded-lg p-1.5 text-[#9CA3AF] hover:bg-[#F4F6F1] hover:text-[#4B5A41]"
              aria-label="Post options"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        </div>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E0E6D9] bg-[#FAF7E6] px-3 py-1.5 text-sm">
          <span className="text-lg leading-none">{post.emoji}</span>
          <span className="font-medium text-[#1F2E13]">{moodLabel}</span>
          <span className="text-[#D1D5DB]">|</span>
          <span className="text-[#7A6B3F]">Intensity: {intensity}/10</span>
        </div>

        {post.reason && (
          <p className="text-[15px] leading-relaxed text-[#4B5A41]">{post.reason}</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#F4F6F1] px-5 py-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLike}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              liked ? 'text-[#DC2626]' : 'text-[#4B5A41] hover:bg-[#F4F6F1]'
            )}
          >
            <Heart className={cn('size-4', liked && 'fill-current')} />
            {likeCount}
          </button>
          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#4B5A41] transition-colors hover:bg-[#F4F6F1]"
          >
            <MessageCircle className="size-4" />
            {commentCount}
          </button>
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#4B5A41] transition-colors hover:bg-[#F4F6F1]"
        >
          <Share2 className="size-4" />
          Share
        </button>
      </div>

      {showComments && (
        <FeedComments
          moodId={post.id}
          accessToken={accessToken}
          commentCount={commentCount}
          onCommentAdded={() => {
            setCommentCount((c) => c + 1)
            onCommentCountChange(post.id, 1)
          }}
        />
      )}
    </article>
  )
}
