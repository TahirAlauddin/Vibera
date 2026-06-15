'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const CARDS = [
  { id: 'default', title: 'Default Card', description: 'With border and background' },
  { id: 'elevated', title: 'Elevated Card', description: 'With shadow effect' },
  { id: 'outlined', title: 'Outlined Card', description: 'Transparent with border' },
] as const

export function CardPlayground() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {CARDS.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => setSelected(card.id)}
          className={cn(
            'rounded-lg p-4 text-left transition-all',
            card.id === 'default' && 'border border-[#E0E6D9] bg-white',
            card.id === 'elevated' && 'bg-white shadow-lg',
            card.id === 'outlined' && 'border-2 border-[#1F2E13] bg-transparent',
            selected === card.id && 'ring-2 ring-[#F6C531] ring-offset-2'
          )}
        >
          <h4 className="mb-2 font-semibold text-[#1F2E13]">{card.title}</h4>
          <p className="text-sm text-[#4B5A41]">{card.description}</p>
        </button>
      ))}
    </div>
  )
}
