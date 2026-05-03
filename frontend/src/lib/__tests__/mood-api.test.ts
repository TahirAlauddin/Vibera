import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  formatTimeAgo,
  getAvatarUrl,
  getMoodLabel,
  pseudoIntensity,
  resolveMediaUrl,
} from '../mood-api'

describe('getMoodLabel', () => {
  it('returns label for known emoji', () => {
    expect(getMoodLabel('😊')).toBe('Happy')
    expect(getMoodLabel('😌')).toBe('Calm')
  })

  it('returns fallback for unknown emoji', () => {
    expect(getMoodLabel('🤔')).toBe('Mood')
  })
})

describe('resolveMediaUrl', () => {
  it('returns null for empty path', () => {
    expect(resolveMediaUrl(null)).toBeNull()
    expect(resolveMediaUrl('')).toBeNull()
  })

  it('returns absolute URLs unchanged', () => {
    expect(resolveMediaUrl('https://cdn.example.com/avatar.png')).toBe(
      'https://cdn.example.com/avatar.png'
    )
  })

  it('prepends API base URL for relative paths', () => {
    expect(resolveMediaUrl('/media/avatars/user.png')).toBe(
      'http://localhost:8000/media/avatars/user.png'
    )
    expect(resolveMediaUrl('media/avatars/user.png')).toBe(
      'http://localhost:8000/media/avatars/user.png'
    )
  })
})

describe('getAvatarUrl', () => {
  it('uses resolved media URL when avatar is provided', () => {
    expect(getAvatarUrl('alice', '/media/alice.png')).toBe(
      'http://localhost:8000/media/alice.png'
    )
  })

  it('falls back to pravatar when no avatar', () => {
    expect(getAvatarUrl('alice')).toBe('https://i.pravatar.cc/150?u=alice')
  })
})

describe('formatTimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-17T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "Just now" for recent timestamps', () => {
    const iso = new Date('2026-06-17T11:59:30.000Z').toISOString()
    expect(formatTimeAgo(iso)).toBe('Just now')
  })

  it('returns minutes ago', () => {
    const iso = new Date('2026-06-17T11:30:00.000Z').toISOString()
    expect(formatTimeAgo(iso)).toBe('30m ago')
  })

  it('returns hours ago', () => {
    const iso = new Date('2026-06-17T08:00:00.000Z').toISOString()
    expect(formatTimeAgo(iso)).toBe('4h ago')
  })
})

describe('pseudoIntensity', () => {
  it('maps mood id to value between 6 and 9', () => {
    expect(pseudoIntensity(1)).toBe(7)
    expect(pseudoIntensity(4)).toBe(6)
    expect(pseudoIntensity(7)).toBe(9)
  })
})
