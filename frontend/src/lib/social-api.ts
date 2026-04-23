import { apiFetch } from './api'

export type UserMinimal = {
  id: number
  username: string
  first_name: string
  last_name: string
}

export type FollowRecord = {
  id: number
  follower?: UserMinimal
  following?: UserMinimal
  created_at: string
  is_following?: boolean
  is_follower?: boolean
  is_mutual?: boolean
}

export type FollowListResponse = {
  count: number
  results: FollowRecord[]
}

export type SocialStats = {
  followers_count: number
  following_count: number
  friends_count: number
}

export type FollowStatus = {
  user_id: number
  is_self: boolean
  is_following: boolean
  is_follower: boolean
  is_mutual: boolean
}

export type SuggestionUser = UserMinimal & {
  is_following: boolean
}

export type SuggestionsResponse = {
  count: number
  results: SuggestionUser[]
}

export function getDisplayName(user: UserMinimal) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()
  return name || user.username
}

export function userFromFollowRecord(
  record: FollowRecord,
  list: 'followers' | 'following'
): UserMinimal & { is_following: boolean; is_mutual: boolean } {
  const user = list === 'followers' ? record.follower : record.following
  if (!user) {
    throw new Error('Invalid follow record')
  }
  return {
    ...user,
    is_following: record.is_following ?? false,
    is_mutual: record.is_mutual ?? false,
  }
}

export async function fetchFollowing(accessToken: string, userId?: number) {
  const path = userId
    ? `/api/social/following/${userId}/`
    : '/api/social/following/'
  return apiFetch<FollowListResponse>(path, { accessToken })
}

export async function fetchFollowers(accessToken: string, userId?: number) {
  const path = userId
    ? `/api/social/followers/${userId}/`
    : '/api/social/followers/'
  return apiFetch<FollowListResponse>(path, { accessToken })
}

export async function fetchSocialStats(accessToken: string) {
  return apiFetch<SocialStats>('/api/social/stats/', { accessToken })
}

export async function fetchFollowSuggestions(accessToken: string) {
  return apiFetch<SuggestionsResponse>('/api/social/suggestions/', { accessToken })
}

export async function fetchFollowStatus(accessToken: string, userId: number) {
  return apiFetch<FollowStatus>(`/api/social/status/${userId}/`, { accessToken })
}

export async function followUser(accessToken: string, userId: number) {
  return apiFetch<FollowRecord>(`/api/social/follow/${userId}/`, {
    method: 'POST',
    accessToken,
    body: JSON.stringify({}),
  })
}

export async function unfollowUser(accessToken: string, userId: number) {
  return apiFetch<{ message: string; user_id: number; is_following: boolean }>(
    `/api/social/unfollow/${userId}/`,
    {
      method: 'DELETE',
      accessToken,
    }
  )
}

export async function toggleFollow(accessToken: string, userId: number, isFollowing: boolean) {
  if (isFollowing) {
    await unfollowUser(accessToken, userId)
    return false
  }
  await followUser(accessToken, userId)
  return true
}
