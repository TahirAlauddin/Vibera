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
}

export type FollowListResponse = {
  count: number
  results: FollowRecord[]
}

export async function fetchFollowing(accessToken: string) {
  return apiFetch<FollowListResponse>('/api/social/following/', { accessToken })
}

export async function fetchFollowers(accessToken: string) {
  return apiFetch<FollowListResponse>('/api/social/followers/', { accessToken })
}

export async function followUser(accessToken: string, userId: number) {
  return apiFetch<FollowRecord>(`/api/social/follow/${userId}/`, {
    method: 'POST',
    accessToken,
    body: JSON.stringify({}),
  })
}

export async function unfollowUser(accessToken: string, userId: number) {
  return apiFetch<{ message: string }>(`/api/social/unfollow/${userId}/`, {
    method: 'DELETE',
    accessToken,
  })
}
