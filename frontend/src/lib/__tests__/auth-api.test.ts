import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerUser } from '../auth-api'

describe('registerUser', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('submits payload and returns created user', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 1,
          email: 'a@b.com',
          username: 'alice',
        }),
      })
    )

    const payload = {
      username: 'alice',
      email: 'a@b.com',
      password: 'pass12345',
      re_password: 'pass12345',
    }
    const result = await registerUser(payload)

    expect(result.username).toBe('alice')
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/auth/users/',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    )
  })

  it('formats field and non-field errors from backend', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          username: ['already exists'],
          non_field_errors: ['invalid payload'],
        }),
      })
    )

    await expect(
      registerUser({
        username: 'alice',
        email: 'a@b.com',
        password: 'pass12345',
        re_password: 'pass12345',
      })
    ).rejects.toThrow('username: already exists invalid payload')
  })
})
