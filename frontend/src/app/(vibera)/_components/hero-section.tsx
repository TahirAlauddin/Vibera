import { LandingCtaButtons } from './landing-cta-buttons'

const MOOD_ENTRIES = [
  { emoji: '🌟', text: 'Feeling inspired today!' },
  { emoji: '💪', text: 'Productive morning' },
  { emoji: '😌', text: 'Relaxing evening' },
]

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1
            className="text-4xl font-bold leading-tight text-[#423E28] sm:text-5xl lg:text-[3.25rem]"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Track Your Mood,
            <br />
            Share Your Story
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#9CA3AF]">
            A daily emoji journal for mindful reflection &amp; community connection
          </p>
          <LandingCtaButtons className="mt-8" />
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#423E28]">Today&apos;s Mood</h2>
              <span className="text-xl" role="img" aria-label="Happy">
                😊
              </span>
            </div>
            <div className="space-y-3">
              {MOOD_ENTRIES.map((entry) => (
                <div
                  key={entry.text}
                  className="flex items-center gap-3 rounded-xl bg-[#FEF9E7] px-4 py-3"
                >
                  <span className="text-lg" role="img" aria-hidden>
                    {entry.emoji}
                  </span>
                  <span className="text-sm text-[#6B7280]">{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
