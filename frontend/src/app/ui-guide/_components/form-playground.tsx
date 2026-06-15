'use client'

import { useState } from 'react'
import { InputBox } from '@/components/custom/inputBox'
import { Textarea } from '@/components/ui/textarea'

const MAX_NOTE_LENGTH = 200

export function InputPlayground() {
  return (
    <div className="grid max-w-lg gap-6">
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#1F2E13]">Primary input</label>
        <InputBox placeholder="Type something..." containerClassName="w-full" />
        <p className="text-xs text-[#7A6B3F]">Focus, type, and clear using the controls.</p>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#1F2E13]">Search input</label>
        <InputBox variant="accent" placeholder="Search..." containerClassName="w-full border-black" />
      </div>
    </div>
  )
}

export function TextAreaPlayground() {
  const [note, setNote] = useState('')

  return (
    <div className="grid max-w-lg gap-6">
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#1F2E13]">Message</label>
        <Textarea
          placeholder="Type your message..."
          className="min-h-28 border-[#E0E6D9] bg-[#F9F6F0] focus-visible:border-[#B2C9AB] focus-visible:ring-[#B2C9AB]/30"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-[#1F2E13]">Note</label>
        <div className="relative">
          <Textarea
            placeholder="Write a note..."
            value={note}
            maxLength={MAX_NOTE_LENGTH}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-32 border-2 border-[#1F2E13] bg-white focus-visible:border-[#1F2E13] focus-visible:ring-0"
          />
          <span className="absolute bottom-3 right-3 text-xs text-[#7A6B3F]">
            {note.length}/{MAX_NOTE_LENGTH}
          </span>
        </div>
      </div>
    </div>
  )
}
