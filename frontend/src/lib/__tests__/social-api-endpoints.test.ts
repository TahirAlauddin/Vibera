import { describe, expect, it, vi } from 'vitest'
import { apiFetch } from '../api'
import {
  fetchFollowSuggestions,
  fetchSocialStats,
  followUser,
  unfollowUser,
} from '../social-api'

vi.mock('../api', () => ({
  apiFetch: vi.fn(),
}))

describe('social-api endpoint wrappers', () => {
  it('fetchSocialStats calls stats endpoint', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({})
    await fetchSocialStats('token')
    expect(apiFetch).toHaveBeenCalledWith('/api/social/stats/', { accessToken: 'token' })
  })

  it('fetchFollowSuggestions calls suggestions endpoint', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ count: 0, results: [] })
    await fetchFollowSuggestions('token')
    expect(apiFetch).toHaveBeenCalledWith('/api/social/suggestions/', { accessToken: 'token' })
  })

  it('followUser posts to follow endpoint', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({})
    await followUser('token', 42)
    expect(apiFetch).toHaveBeenCalledWith('/api/social/follow/42/', {
      method: 'POST',
      accessToken: 'token',
      body: JSON.stringify({}),
    })
  })

  it('unfollowUser deletes from unfollow endpoint', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({})
    await unfollowUser('token', 42)
    expect(apiFetch).toHaveBeenCalledWith('/api/social/unfollow/42/', {
      method: 'DELETE',
      accessToken: 'token',
    })
  })
})
