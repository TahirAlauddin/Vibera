'use client'
import Image from 'next/image'
import Link from 'next/link'
import Features from '@/components/features'
import Testimonials from '@/components/testimonials'
import { useToast } from '@/components/ui/use-toast'
import { useEffect } from 'react'


export default function Home() {
  const { toast } = useToast()
  // #region agent log
  useEffect(() => {
    const logDataHome = {location:'page.tsx:10',message:'Home component rendering',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
    fetch('http://127.0.0.1:7242/ingest/6e222ad1-38db-49c9-b946-37f1317673cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataHome)}).catch(()=>{});
  }, []);
  // #endregion agent log


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
          {/* Toast Test Section - Remove in production */}
          <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-3 text-center">🧪 Toast Variant Tests</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  // #region agent log
                  const logDataBtn = {location:'page.tsx:86',message:'Success button clicked',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
                  fetch('http://127.0.0.1:7242/ingest/6e222ad1-38db-49c9-b946-37f1317673cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataBtn)}).catch(()=>{});
                  // #endregion agent log
                  toast({ variant: 'success', message: 'Operation completed successfully! 🎉' })
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Success Toast
              </button>
              <button
                onClick={() => toast({ variant: 'error', message: 'Something went wrong! Please try again.' })}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Error Toast
              </button>
              <button
                onClick={() => toast({ variant: 'info', message: 'Here is some useful information for you.' })}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Info Toast
              </button>
              <button
                onClick={() => toast({ variant: 'warning', message: 'Warning: Please review this action carefully.' })}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Warning Toast
              </button>
              <button
                onClick={() => toast({ variant: 'message', message: 'This is a simple message toast without an icon.' })}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Message Toast
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Click each button to test the toast variants with TSX/CVA styling
            </p>
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