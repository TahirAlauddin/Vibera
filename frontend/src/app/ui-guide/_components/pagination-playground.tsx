'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const TOTAL_PAGES = 10

export function PaginationPlayground() {
  const [current, setCurrent] = useState(1)
  const [dotActive, setDotActive] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState('10')
  const [jumpInput, setJumpInput] = useState('1')

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(TOTAL_PAGES, page))
    setCurrent(clamped)
    setJumpInput(String(clamped))
  }

  const visiblePages = [1, 2, 3, 4, 5, '...', TOTAL_PAGES] as const

  return (
    <div className="space-y-10">
      <div>
        <p className="mb-3 text-sm font-medium text-[#7A6B3F]">Dot pagination</p>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setDotActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                'rounded-full transition-all',
                i === dotActive ? 'size-3 bg-[#F6C531]' : 'size-2 bg-[#D1D5DB] hover:bg-[#F6C531]/50'
              )}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[#7A6B3F]">Page numbers</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goToPage(current - 1)}
            disabled={current === 1}
            className="flex size-8 items-center justify-center rounded text-[#7A6B3F] hover:bg-[#F4F6F1] disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </button>

          {visiblePages.map((page, i) =>
            typeof page === 'number' ? (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(page)}
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
            onClick={() => goToPage(current + 1)}
            disabled={current === TOTAL_PAGES}
            className="flex size-8 items-center justify-center rounded text-[#7A6B3F] hover:bg-[#F4F6F1] disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[#7A6B3F]">Compact</p>
        <div className="flex items-center gap-3 text-sm text-[#4B5A41]">
          <button
            type="button"
            onClick={() => goToPage(current - 1)}
            disabled={current === 1}
            className="rounded border border-[#E0E6D9] px-3 py-1.5 hover:bg-[#F4F6F1] disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {current} of {TOTAL_PAGES}
          </span>
          <button
            type="button"
            onClick={() => goToPage(current + 1)}
            disabled={current === TOTAL_PAGES}
            className="rounded border border-[#E0E6D9] px-3 py-1.5 hover:bg-[#F4F6F1] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[#7A6B3F]">Jump to page</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#4B5A41]">
          <span>Go to page</span>
          <input
            type="number"
            min={1}
            max={TOTAL_PAGES}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            className="h-8 w-14 rounded border border-[#E0E6D9] bg-[#F9F6F0] text-center text-sm"
          />
          <button
            type="button"
            onClick={() => goToPage(Number(jumpInput) || 1)}
            className="rounded bg-[#F6C531] px-3 py-1.5 text-sm font-medium text-[#1F2E13] hover:bg-[#E0A800]"
          >
            Go
          </button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[#7A6B3F]">Rows per page</p>
        <div className="flex items-center gap-3 text-sm text-[#4B5A41]">
          <span>Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(e.target.value)}
            className="h-9 rounded-lg border border-[#E0E6D9] bg-[#F9F6F0] px-3 text-sm"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  )
}
