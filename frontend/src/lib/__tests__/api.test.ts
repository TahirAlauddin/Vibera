import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiFetch, AuthenticationError } from '../api'

describe('AuthenticationError', () => {
  it('sets name and statusCode', () => {
    const err = new AuthenticationError('Session expired', 401)

    expect(err.name).toBe('AuthenticationError')
    expect(err.message).toBe('Session expired')
    expect(err.statusCode).toBe(401)
  })
})

describe('apiFetch', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('prepends API base URL for relative paths', async () => {
    await apiFetch('/api/moods/')

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/moods/',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    )
  })

  it('uses absolute URLs as-is', async () => {
    await apiFetch('https://example.com/data')

    expect(fetch).toHaveBeenCalledWith('https://example.com/data', expect.any(Object))
  })

  it('injects Bearer token when accessToken is provided', async () => {
    await apiFetch('/api/me/', { accessToken: 'test-token' })

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })

  it('throws AuthenticationError on 401', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: 'Invalid token' }),
      })
    )

    await expect(apiFetch('/api/protected/')).rejects.toThrow(AuthenticationError)
    await expect(apiFetch('/api/protected/')).rejects.toThrow('Invalid token')
  })

  it('throws generic Error on other failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      })
    )

    await expect(apiFetch('/api/broken/')).rejects.toThrow('Server error')
  })
})
