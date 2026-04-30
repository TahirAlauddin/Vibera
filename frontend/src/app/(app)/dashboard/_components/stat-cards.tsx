import { Calendar, Heart, TrendingUp, type LucideIcon } from 'lucide-react'

type DashboardStats = {
  total: number
  streak: number
  avgIntensity: string
}

type StatCardsProps = {
  stats: DashboardStats
}

const STAT_CONFIG = [
  { label: 'Total Entries', key: 'total' as const, icon: 'calendar' as const },
  { label: 'Day Streak', key: 'streak' as const, icon: 'trending' as const },
  { label: 'Avg Intensity', key: 'avgIntensity' as const, icon: 'heart' as const },
]

const ICON_MAP: Record<(typeof STAT_CONFIG)[number]['icon'], LucideIcon> = {
  calendar: Calendar,
  trending: TrendingUp,
  heart: Heart,
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STAT_CONFIG.map((stat) => {
        const Icon = ICON_MAP[stat.icon]
        const value = String(stats[stat.key])
        return (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#F6C531]/25">
              <Icon className="size-5 text-[#C9A020]" strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-tight text-[#1F2E13]">{value}</p>
              <p className="text-sm text-[#7A6B3F]">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
