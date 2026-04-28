'use client'

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOOD_OPTIONS } from '@/lib/mood-api'

type CreatePostComposerProps = {
  avatarUrl: string
  displayName: string
  onSubmit: (emoji: string, reason: string) => Promise<void>
}

export function CreatePostComposer({ avatarUrl, displayName, onSubmit }: CreatePostComposerProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string>(MOOD_OPTIONS[0].emoji)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(selectedEmoji, reason.trim())
      setReason('')
      setExpanded(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex gap-3">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-[#F4F6F1]">
          <Image src={avatarUrl} alt={displayName} fill className="object-cover" sizes="44px" />
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex-1 rounded-xl bg-[#FAF7E6] px-4 py-3 text-left text-sm text-[#7A6B3F] transition-colors hover:bg-[#F4F6F1]"
        >
          What&apos;s on your mind, {displayName.split(' ')[0]}?
        </button>
      </div>

      {expanded && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 border-t border-[#F4F6F1] pt-4">
          <div>
            <p className="mb-2 text-sm font-medium text-[#4B5A41]">How are you feeling?</p>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(mood.emoji)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition-colors',
                    selectedEmoji === mood.emoji
                      ? 'bg-[#F6C531]/25 ring-2 ring-[#F6C531]'
                      : 'bg-[#F4F6F1] hover:bg-[#E8EBE3]'
                  )}
                >
                  <span className="text-lg">{mood.emoji}</span>
                  <span className="font-medium text-[#4B5A41]">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Share what's happening..."
            rows={3}
            className="w-full resize-none rounded-xl border border-[#E0E6D9] bg-[#FAF7E6] px-4 py-3 text-sm text-[#1F2E13] outline-none focus:border-[#F6C531] focus:ring-2 focus:ring-[#F6C531]/30"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-[#4B5A41] hover:bg-[#F4F6F1]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F6C531] px-5 py-2 text-sm font-semibold text-[#1F2E13] transition-colors hover:bg-[#E0B42D] disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Post mood
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
