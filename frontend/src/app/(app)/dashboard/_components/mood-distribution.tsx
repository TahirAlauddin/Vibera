type MoodDistributionItem = {
  mood: string
  entries: number
  percent: number
  color: string
}

type MoodDistributionProps = {
  distribution: MoodDistributionItem[]
}

export function MoodDistribution({ distribution }: MoodDistributionProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-[#1F2E13]">Mood Distribution (All Time)</h2>

      {distribution.length === 0 ? (
        <p className="text-sm text-[#7A6B3F]">
          No mood data yet. Log your first entry to see how your moods break down over time.
        </p>
      ) : (
        <div className="space-y-5">
          {distribution.map((item) => (
            <div key={item.mood} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-16 shrink-0 text-sm font-medium text-[#4B5A41]">{item.mood}</span>
              <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="shrink-0 text-sm text-[#7A6B3F] sm:w-28 sm:text-right">
                {item.entries} entries ({item.percent}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
