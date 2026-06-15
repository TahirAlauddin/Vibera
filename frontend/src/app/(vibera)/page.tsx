import { HeroSection } from './_components/hero-section'
import { ConnectShareSection } from './_components/connect-share-section'
import { ReflectionTrendsSection } from './_components/reflection-trends-section'
import { NeverMissDaySection } from './_components/never-miss-day-section'
import { BottomCtaSection } from './_components/bottom-cta-section'

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ConnectShareSection />
      <ReflectionTrendsSection />
      <NeverMissDaySection />
      <BottomCtaSection />
    </>
  )
}
