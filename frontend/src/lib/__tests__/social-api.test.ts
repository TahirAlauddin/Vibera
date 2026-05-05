import { describe, expect, it, vi } from 'vitest'
import { apiFetch } from '../api'
import {
  fetchFollowers,
  fetchFollowing,
  fetchFollowStatus,
  getDisplayName,
  toggleFollow,
  userFromFollowRecord,
} from '../social-api'

vi.mock('../api', () => ({
  apiFetch: vi.fn(),
}))

describe('social-api helpers', () => {
  it('getDisplayName prefers first and last name', () => {
    expect(
      getDisplayName({
        id: 1,
        username: 'alice',
        first_name: 'Alice',
        last_name: 'Doe',
      })
    ).toBe('Alice Doe')
  })

  it('getDisplayName falls back to username', () => {
    expect(
      getDisplayName({
        id: 1,
        username: 'alice',
        first_name: '',
        last_name: '',
      })
    ).toBe('alice')
  })

  it('userFromFollowRecord maps follower list correctly', () => {
    const user = userFromFollowRecord(
      {
        id: 1,
        follower: { id: 2, username: 'bob', first_name: 'Bob', last_name: 'B' },
        created_at: '2026-01-01',
        is_following: true,
        is_mutual: false,
      },
      'followers'
    )
    expect(user.username).toBe('bob')
    expect(user.is_following).toBe(true)
    expect(user.is_mutual).toBe(false)
  })

  it('userFromFollowRecord throws on invalid record', () => {
    expect(() =>
      userFromFollowRecord({ id: 1, created_at: '2026-01-01' }, 'following')
    ).toThrow('Invalid follow record')
  })
})

describe('social-api network calls', () => {
  it('fetchFollowing uses current-user endpoint when no userId', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ count: 0, results: [] })
    await fetchFollowing('token')
    expect(apiFetch).toHaveBeenCalledWith('/api/social/following/', { accessToken: 'token' })
  })

  it('fetchFollowers uses user-specific endpoint with userId', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ count: 0, results: [] })
    await fetchFollowers('token', 10)
    expect(apiFetch).toHaveBeenCalledWith('/api/social/followers/10/', { accessToken: 'token' })
  })

  it('fetchFollowStatus builds status endpoint', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({})
    await fetchFollowStatus('token', 3)
    expect(apiFetch).toHaveBeenCalledWith('/api/social/status/3/', { accessToken: 'token' })
  })

  it('toggleFollow unfollows when already following', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({})
    const next = await toggleFollow('token', 11, true)
    expect(next).toBe(false)
    expect(apiFetch).toHaveBeenCalledWith('/api/social/unfollow/11/', {
      method: 'DELETE',
      accessToken: 'token',
    })
  })

  it('toggleFollow follows when not following', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({})
    const next = await toggleFollow('token', 11, false)
    expect(next).toBe(true)
    expect(apiFetch).toHaveBeenCalledWith('/api/social/follow/11/', {
      method: 'POST',
      accessToken: 'token',
      body: JSON.stringify({}),
    })
  })
})
