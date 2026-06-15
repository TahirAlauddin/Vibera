import { apiFetch } from './api'
import type { BackendUser } from '@/types/next-auth'

export type UserProfile = {
  id: number
  user: number
  avatar: string | null
  followers_count: number
  following_count: number
  created_at: string
}

export type UpdateUserPayload = {
  username?: string
  email?: string
  first_name?: string
  last_name?: string
}

export async function fetchCurrentUser(accessToken: string) {
  return apiFetch<BackendUser>('/api/auth/users/me/', { accessToken })
}

export async function updateCurrentUser(accessToken: string, data: UpdateUserPayload) {
  return apiFetch<BackendUser>('/api/auth/users/me/', {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(data),
  })
}

export async function fetchMyProfile(accessToken: string) {
  return apiFetch<UserProfile>('/api/users/profiles/me/', { accessToken })
}
