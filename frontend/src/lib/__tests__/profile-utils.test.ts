import { describe, expect, it, vi } from 'vitest'
import { apiFetch } from '../api'
import { fetchCurrentUser, fetchMyProfile, updateCurrentUser } from '../profile-api'
import { cn } from '../utils'

vi.mock('../api', () => ({
  apiFetch: vi.fn(),
}))

describe('profile-api', () => {
  it('fetchCurrentUser calls users/me endpoint', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({})
    await fetchCurrentUser('token')
    expect(apiFetch).toHaveBeenCalledWith('/api/auth/users/me/', { accessToken: 'token' })
  })

  it('updateCurrentUser sends PATCH payload', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({})
    const payload = { first_name: 'A', last_name: 'B' }
    await updateCurrentUser('token', payload)
    expect(apiFetch).toHaveBeenCalledWith('/api/auth/users/me/', {
      method: 'PATCH',
      accessToken: 'token',
      body: JSON.stringify(payload),
    })
  })

  it('fetchMyProfile calls profile endpoint', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({})
    await fetchMyProfile('token')
    expect(apiFetch).toHaveBeenCalledWith('/api/users/profiles/me/', { accessToken: 'token' })
  })
})

describe('cn utility', () => {
  it('merges class names and resolves tailwind conflicts', () => {
    expect(cn('p-2', 'p-4', 'text-sm', 'text-lg')).toBe('p-4 text-lg')
  })
})
