'use client'
import Image from 'next/image'
import Link from 'next/link'
import Features from '@/components/features'
import Testimonials from '@/components/testimonials'
import { useToast } from '@/components/ui'

export default function Home() {
  const { toast, dismiss } = useToast()

  // Temporary toast testing functions
  const testToasts = () => {
    // Test all variants
    toast({ variant: 'correct', message: 'Success! This is a correct/success toast.' })
    setTimeout(() => {
      toast({ variant: 'error', message: 'Error! This is an error toast.' })
    }, 500)
    setTimeout(() => {
      toast({ variant: 'info', message: 'Info: This is an informational toast.' })
    }, 1000)
    setTimeout(() => {
      toast({ variant: 'warning', message: 'Warning: This is a warning toast.' })
    }, 1500)
    setTimeout(() => {
      toast({ variant: 'message', message: 'Message: This is a default message toast.' })
    }, 2000)
  }

  const testDismissAll = () => {
    dismiss()
  }

  const testLongDuration = () => {
    toast({ variant: 'info', message: 'This toast lasts 10 seconds', duration: 10000 })
  }

  const testInfiniteDuration = () => {
    toast({ variant: 'warning', message: 'This toast stays until manually dismissed', duration: 0 })
  }
  const decorativeEmojis = [
    {
      emoji: '😊',
      position: 'top-20 left-24',
      size: 'text-2xl',
      opacity: 'opacity-70',
    },
    {
      emoji: '😁',
      position: 'top-40 left-1/3',
      size: 'text-2xl',
      opacity: 'opacity-70',
    },
    {
      emoji: '😍',
      position: 'top-18 right-28',
      size: 'text-3xl',
      opacity: 'opacity-70',
    },
    {
      emoji: '😳',
      position: 'bottom-32 right-20',
      size: 'text-2xl',
      opacity: 'opacity-70',
    },
    {
      emoji: '🥰',
      position: 'top-130 left-1/6',
      size: 'text-2xl',
      opacity: 'opacity-80',
    },
    {
      emoji: '😜',
      position: 'top-140 left-1/2',
      size: 'text-2xl',
      opacity: 'opacity-80',
    },
  ]
  return ( 
    <div> 
      <div className="h-auto min-h-[80vh] flex flex-col  md:flex-row">
        {/* Decorative emoji elements */}
        {decorativeEmojis.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position} ${item.size} ${item.opacity} animate-pulse`}
          >
            {item.emoji}
          </div>
        ))}
        <div className="flex flex-1 justify-center flex-col items-center">
          <h1 className="text-center p-4 font-bold text-3xl sm:text-4xl color-accent ">
            VIBERA: Track Your Mood, Share Story
          </h1>
          <p className="p-4 text-center">
            A daily mood journal for mindful reflection & community connection
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
            <Link
              href="/signup"
              className="color-primary text-white font-bold px-6 py-2 cursor-pointer rounded-full hover:bg-primary/80 text-center"
            >
              Get Started - it&apos;s Free
            </Link>
            <button className="bg-white text-accent border cursor-pointer border-primary font-bold px-6 py-2 rounded-full hover:bg-white/80">
              Learn More
            </button>
          </div>
          {/* Temporary Toast Testing Section - Remove after testing */}
          <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-lg font-bold mb-3 text-center">🧪 Toast Testing (Temporary)</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={testToasts}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
              >
                Test All Variants
              </button>
              <button
                onClick={testDismissAll}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
              >
                Dismiss All
              </button>
              <button
                onClick={testLongDuration}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-sm"
              >
                Test Long Duration (10s)
              </button>
              <button
                onClick={testInfiniteDuration}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
              >
                Test Infinite Duration
              </button>
              <button
                onClick={() => toast({ variant: 'correct', message: 'Single Success Toast' })}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
              >
                Single Success
              </button>
              <button
                onClick={() => toast({ variant: 'error', message: 'Single Error Toast' })}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
              >
                Single Error
              </button>
            </div>
          </div>
        </div>
        {/* Product demo */}
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
          <Image
            src="/assets/hero.jpeg"
            alt="product demo"
            width={520}
            height={520}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
      <div>
        <Features />
      </div>
      <div className="color-secondary py-5">
        <h2 className="text-white py-3 font-bold text-3xl sm:text-4xl text-center">
          Join the Vibera Community
        </h2>
        <Testimonials />
      </div>
    </div>
  )
}