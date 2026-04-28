import { MoreHorizontal, TrendingUp } from 'lucide-react'

const STATS = [
  { title: 'Mood Entries', value: '124', change: '+10.7%', note: 'from last month' },
  { title: 'Total Followers', value: '1,200', change: '+10%', note: 'increase' },
  { title: 'Total Following', value: '500', change: '+2%', note: 'growth' },
  { title: 'Engagement Rate', value: '85%', change: '+3%', note: 'increase' },
] as const

export function ProfileStatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl bg-[#FEF9E7] p-4 shadow-sm ring-1 ring-[#F6C531]/20"
        >
          <div className="mb-3 flex items-start justify-between">
            <p className="text-sm font-medium text-[#7A6B3F]">{stat.title}</p>
            <button
              type="button"
              className="rounded-md p-1 text-[#9CA3AF] transition-colors hover:bg-white/60 hover:text-[#4B5A41]"
              aria-label={`Options for ${stat.title}`}
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>
          <p className="text-2xl font-bold text-[#1F2E13]">{stat.value}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-[#6B8F5E]">
            <TrendingUp className="size-3" />
            {stat.change} {stat.note}
          </p>
        </div>
      ))}
    </div>
  )
}
