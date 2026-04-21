const WEEKLY_MOODS = [
  { day: 'Mon', emoji: '😊' },
  { day: 'Tue', emoji: '😌' },
  { day: 'Wed', emoji: '😰' },
  { day: 'Thu', emoji: '😐' },
  { day: 'Fri', emoji: '😌' },
  { day: 'Sat', emoji: '😠' },
  { day: 'Sun', emoji: '😊' },
]

export function ReflectionTrendsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <h3 className="mb-5 text-base font-semibold text-[#423E28]">Weekly Mood Tracker</h3>
            <div className="grid grid-cols-7 gap-2">
              {WEEKLY_MOODS.map((entry) => (
                <div key={entry.day} className="flex flex-col items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#F4F6F1] text-lg sm:size-11">
                    {entry.emoji}
                  </div>
                  <span className="text-[10px] font-medium text-[#9CA3AF] sm:text-xs">
                    {entry.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-[#E8F5E3] px-4 py-3">
              <p className="mb-2 text-xs font-semibold text-[#6B8F5E]">Trending Emotions</p>
              <div className="flex gap-2">
                <span className="flex size-9 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                  😊
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                  🌟
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <h2
            className="text-3xl font-bold text-[#423E28] sm:text-4xl"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Daily Reflection &amp; Trends
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#9CA3AF]">
            Track your emotional patterns over time and identify what triggers different moods.
            Visualize your journey with beautiful charts and insights that help you understand
            yourself better.
          </p>
        </div>
      </div>
    </section>
  )
}
