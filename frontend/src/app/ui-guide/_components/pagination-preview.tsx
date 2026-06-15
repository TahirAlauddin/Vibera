import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PaginationDots({ active = 0, total = 5 }: { active?: number; total?: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all',
            i === active ? 'size-3 bg-[#F6C531]' : 'size-2 bg-[#D1D5DB]'
          )}
        />
      ))}
    </div>
  )
}

export function PaginationPages({ current = 1 }: { current?: number }) {
  const pages = [1, 2, 3, 4, 5, '...', 10] as const

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className="flex size-8 items-center justify-center rounded text-[#7A6B3F] hover:bg-[#F4F6F1]"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((page, i) =>
        typeof page === 'number' ? (
          <button
            key={i}
            type="button"
            className={cn(
              'flex size-8 items-center justify-center rounded text-sm font-medium',
              page === current
                ? 'bg-[#F6C531] text-[#1F2E13]'
                : 'text-[#7A6B3F] hover:bg-[#F4F6F1]'
            )}
          >
            {page}
          </button>
        ) : (
          <span key={i} className="px-1 text-sm text-[#7A6B3F]">
            {page}
          </span>
        )
      )}

      <button
        type="button"
        className="flex size-8 items-center justify-center rounded text-[#7A6B3F] hover:bg-[#F4F6F1]"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

export function PaginationCompact() {
  return (
    <div className="flex items-center gap-3 text-sm text-[#4B5A41]">
      <button
        type="button"
        className="rounded border border-[#E0E6D9] px-3 py-1.5 hover:bg-[#F4F6F1]"
      >
        Previous
      </button>
      <span>Page 1 of 10</span>
      <button
        type="button"
        className="rounded border border-[#E0E6D9] px-3 py-1.5 hover:bg-[#F4F6F1]"
      >
        Next
      </button>
    </div>
  )
}

export function PaginationWithJump() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <PaginationPages />
      <div className="flex items-center gap-2 text-sm text-[#4B5A41]">
        <span>Go to page</span>
        <input
          type="text"
          defaultValue="1"
          className="h-8 w-12 rounded border border-[#E0E6D9] bg-[#F9F6F0] text-center text-sm"
          readOnly
        />
        <button
          type="button"
          className="rounded bg-[#F6C531] px-3 py-1.5 text-sm font-medium text-[#1F2E13]"
        >
          Go
        </button>
      </div>
    </div>
  )
}
