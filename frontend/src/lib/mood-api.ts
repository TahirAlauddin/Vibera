import { apiFetch } from './api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type FeedUserProfile = {
  username: string
  avatar: string | null
}

export type MoodEntry = {
  id: number
  user: string
  emoji: string
  reason: string | null
  comment_count: number
  created_at: string
  updated_at: string
}

export type FeedMood = MoodEntry & {
  author_id: number
  is_following: boolean
  user_profile: FeedUserProfile | null
}

export type MoodComment = {
  id: number
  user: string
  content: string
  parent: number | null
  replies: MoodCommentReply[] | null
  reply_count: number
  created_at: string
  updated_at: string
}

export type MoodCommentReply = {
  id: number
  user: string
  content: string
  created_at: string
  updated_at: string
}

export const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😌', label: 'Calm' },
] as const

const MOOD_LABEL_MAP = Object.fromEntries(MOOD_OPTIONS.map((m) => [m.emoji, m.label]))

export function getMoodLabel(emoji: string) {
  return MOOD_LABEL_MAP[emoji] ?? 'Mood'
}

export function resolveMediaUrl(path: string | null) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function getAvatarUrl(username: string, avatar?: string | null) {
  return resolveMediaUrl(avatar) ?? `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`
}

export function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export function pseudoIntensity(moodId: number) {
  return (moodId % 4) + 6
}

export async function fetchMyMoods(accessToken: string, page = 1, pageSize = 50) {
  return apiFetch<PaginatedResponse<MoodEntry>>(
    `/api/moods/?page=${page}&page_size=${pageSize}`,
    { accessToken }
  )
}

export async function updateMood(
  accessToken: string,
  moodId: number,
  data: { emoji?: string; reason?: string }
) {
  return apiFetch<MoodEntry>(`/api/moods/${moodId}/`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(data),
  })
}

export async function deleteMood(accessToken: string, moodId: number) {
  const fullUrl = `${API_BASE_URL}/api/moods/${moodId}/`
  const res = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to delete mood (${res.status})`)
  }
}

export async function fetchMoodFeed(accessToken: string, page = 1, pageSize = 10) {
  return apiFetch<PaginatedResponse<FeedMood>>(
    `/api/moods/feed/?page=${page}&page_size=${pageSize}`,
    { accessToken }
  )
}

export async function createMood(
  accessToken: string,
  data: { emoji: string; reason?: string }
) {
  return apiFetch<MoodEntry>('/api/moods/', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(data),
  })
}

export async function fetchMoodComments(accessToken: string, moodId: number) {
  return apiFetch<MoodComment[]>(`/api/moods/${moodId}/comments/`, { accessToken })
}

export async function createMoodComment(
  accessToken: string,
  moodId: number,
  content: string
) {
  return apiFetch<MoodComment>(`/api/moods/${moodId}/comments/`, {
    method: 'POST',
    accessToken,
    body: JSON.stringify({ content }),
  })
}

export async function createCommentReply(
  accessToken: string,
  commentId: number,
  content: string
) {
  return apiFetch<MoodComment>(`/api/moods/comments/${commentId}/replies/`, {
    method: 'POST',
    accessToken,
    body: JSON.stringify({ content }),
  })
}
