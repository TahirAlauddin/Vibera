import { describe, expect, it, vi } from 'vitest'
import { apiFetch } from '../api'
import { createMood, fetchMoodFeed, fetchMyMoods } from '../mood-api'

vi.mock('../api', () => ({
  apiFetch: vi.fn(),
}))

describe('mood-api fetch helpers', () => {
  it('fetchMyMoods normalizes paginated responses', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      count: 1,
      next: null,
      previous: null,
      results: [{ id: 1, emoji: '😊' }],
    })

    const result = await fetchMyMoods('token', 2, 25)

    expect(apiFetch).toHaveBeenCalledWith('/api/moods/?page=2&page_size=25', {
      accessToken: 'token',
    })
    expect(result.count).toBe(1)
    expect(result.results).toHaveLength(1)
  })

  it('fetchMyMoods normalizes plain arrays', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce([{ id: 2, emoji: '😌' }])

    const result = await fetchMyMoods('token')

    expect(result.count).toBe(1)
    expect(result.next).toBeNull()
    expect(result.results[0].id).toBe(2)
  })

  it('fetchMoodFeed requests feed endpoint with pagination', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ count: 0, results: [] })

    await fetchMoodFeed('token', 3, 15)

    expect(apiFetch).toHaveBeenCalledWith('/api/moods/feed/?page=3&page_size=15', {
      accessToken: 'token',
    })
  })

  it('createMood posts emoji payload', async () => {
    ;(apiFetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: 9, emoji: '😊' })

    await createMood('token', { emoji: '😊', reason: 'Great day' })

    expect(apiFetch).toHaveBeenCalledWith('/api/moods/', {
      method: 'POST',
      accessToken: 'token',
      body: JSON.stringify({ emoji: '😊', reason: 'Great day' }),
    })
  })
})
