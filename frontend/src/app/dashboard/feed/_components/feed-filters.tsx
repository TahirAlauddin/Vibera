'use client'

import { cn } from '@/lib/utils'

export type FeedFilter = 'all' | 'friends' | 'following'

const FILTERS: { id: FeedFilter; label: string }[] = [
  { id: 'all', label: 'All Posts' },
  { id: 'friends', label: 'Friends' },
  { id: 'following', label: 'Following' },
]

type FeedFiltersProps = {
  active: FeedFilter
  onChange: (filter: FeedFilter) => void
}

export function FeedFilters({ active, onChange }: FeedFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onChange(filter.id)}
          className={cn(
            'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
            active === filter.id
              ? 'bg-[#F6C531] text-[#1F2E13]'
              : 'text-[#4B5A41] hover:bg-[#F4F6F1]'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
