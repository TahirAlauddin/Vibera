import { LandingCtaButtons } from './landing-cta-buttons'

export function BottomCtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="text-center">
        <h2
          className="text-3xl font-bold text-[#423E28] sm:text-4xl"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          Ready to Start Your Emoji Journey?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-[#9CA3AF]">
          Join thousands of people tracking their moods and building healthier emotional habits.
        </p>
        <LandingCtaButtons className="mt-8 justify-center" />
      </div>
    </section>
  )
}
