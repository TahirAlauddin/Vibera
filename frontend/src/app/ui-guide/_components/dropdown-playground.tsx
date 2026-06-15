'use client'

import { DropdownPreview, MultiSelectPreview } from './dropdown-preview'

export function DropdownPlayground() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#1F2E13]">Single select</p>
        <DropdownPreview placeholder="Choose an option" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#1F2E13]">Multi select</p>
        <MultiSelectPreview />
      </div>
    </div>
  )
}
