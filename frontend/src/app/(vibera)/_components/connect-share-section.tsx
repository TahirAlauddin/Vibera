import { Globe, Users } from 'lucide-react'

const FEATURES = [
  {
    icon: Globe,
    title: 'Public Feed',
    description:
      'Share your moods with the community and discover how others are feeling. Connect through shared experiences.',
    emojis: ['😊', '🎉', '😌', '💪'],
  },
  {
    icon: Users,
    title: 'Friends & Followers',
    description:
      'Build your support network by following friends and sharing your journey together in a safe space.',
    emojis: ['🤝', '💚', '🌟', '✨'],
  },
] as const

export function ConnectShareSection() {
  return (
    <section id="connect-share" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-10 text-center">
        <h2
          className="text-3xl font-bold text-[#423E28] sm:text-4xl"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          Connect &amp; Share
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-[#9CA3AF]">
          Join a community that understands. Share your emotional journey and support others along
          the way.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-8"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#E8F5E3]">
              <feature.icon className="size-6 text-[#6B8F5E]" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-[#423E28]">{feature.title}</h3>
            <p className="mb-6 text-sm leading-relaxed text-[#9CA3AF]">{feature.description}</p>
            <div className="flex gap-2">
              {feature.emojis.map((emoji) => (
                <span
                  key={emoji}
                  className="flex size-10 items-center justify-center rounded-full bg-[#F4F6F1] text-lg"
                  role="img"
                  aria-hidden
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
