import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiFetch } from '../api'
import {
  createCommentReply,
  createMoodComment,
  deleteMood,
  fetchMoodComments,
  updateMood,
} from '../mood-api'

vi.mock('../api', () => ({
  apiFetch: vi.fn(),
}))

describe('mood-api mutations', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('updateMood sends PATCH payload', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: 1 })

    await updateMood('token', 1, { emoji: '😔' })

    expect(apiFetch).toHaveBeenCalledWith('/api/moods/1/', {
      method: 'PATCH',
      accessToken: 'token',
      body: JSON.stringify({ emoji: '😔' }),
    })
  })

  it('deleteMood calls DELETE with bearer token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
      })
    )

    await deleteMood('token', 5)

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/moods/5/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
    })
  })

  it('deleteMood throws on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
      })
    )

    await expect(deleteMood('token', 5)).rejects.toThrow('Failed to delete mood (403)')
  })

  it('fetchMoodComments requests comments endpoint', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce([])

    await fetchMoodComments('token', 12)

    expect(apiFetch).toHaveBeenCalledWith('/api/moods/12/comments/', { accessToken: 'token' })
  })

  it('createMoodComment posts content', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: 3 })

    await createMoodComment('token', 12, 'Nice post')

    expect(apiFetch).toHaveBeenCalledWith('/api/moods/12/comments/', {
      method: 'POST',
      accessToken: 'token',
      body: JSON.stringify({ content: 'Nice post' }),
    })
  })

  it('createCommentReply posts to reply endpoint', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: 4 })

    await createCommentReply('token', 7, 'Thanks!')

    expect(apiFetch).toHaveBeenCalledWith('/api/moods/comments/7/replies/', {
      method: 'POST',
      accessToken: 'token',
      body: JSON.stringify({ content: 'Thanks!' }),
    })
  })
})
