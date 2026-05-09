import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FeedFilters } from '@/app/(app)/feed/_components/feed-filters'

describe('FeedFilters', () => {
  afterEach(() => {
    cleanup()
  })
  it('renders all filter options', () => {
    render(<FeedFilters active="all" onChange={() => {}} />)

    expect(screen.getByRole('button', { name: 'All Posts' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Friends' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Following' })).toBeInTheDocument()
  })

  it('calls onChange when a filter is clicked', () => {
    const onChange = vi.fn()
    render(<FeedFilters active="all" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Friends' }))

    expect(onChange).toHaveBeenCalledWith('friends')
  })
})
