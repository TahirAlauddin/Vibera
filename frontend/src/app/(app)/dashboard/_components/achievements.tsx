import { Award, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACHIEVEMENTS } from './dashboard-data'

export function Achievements() {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Award className="size-5 text-[#F6C531]" />
        <h2 className="text-lg font-bold text-[#1F2E13]">Achievements</h2>
      </div>

      <ul className="space-y-3">
        {ACHIEVEMENTS.map((achievement) => (
          <li
            key={achievement.title}
            className={cn(
              'flex items-center justify-between rounded-xl border px-4 py-3',
              achievement.unlocked
                ? 'border-[#F6C531]/50 bg-[#FEF9E7]'
                : 'border-[#E0E6D9] bg-[#F4F6F1] opacity-50'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl" role="img" aria-hidden>
                {achievement.icon}
              </span>
              <span
                className={cn(
                  'text-sm font-medium',
                  achievement.unlocked ? 'text-[#1F2E13]' : 'text-[#9CA3AF]'
                )}
              >
                {achievement.title}
              </span>
            </div>
            {achievement.unlocked && (
              <Check className="size-5 text-[#F6C531]" strokeWidth={2.5} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
