'use client'

import { CircleArrowLeft, ExternalLink, Plus } from 'lucide-react'
import { Button } from '@/components/custom/button'

export function ButtonPlayground() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm" variant="primary">
        <CircleArrowLeft />
        Primary
      </Button>
      <Button size="default" variant="secondary">
        <ExternalLink />
        Secondary
      </Button>
      <Button size="lg" variant="ghost">
        Ghost
      </Button>
      <Button size="default" variant="disabled" disabled>
        Disabled
      </Button>
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-full border border-[#F6C531] bg-[#F6C531] text-white transition-colors hover:bg-[#757575] hover:border-[#757575] active:bg-[#B2C9AB] active:border-[#B2C9AB]"
        aria-label="Add"
      >
        <Plus className="size-5" />
      </button>
    </div>
  )
}
