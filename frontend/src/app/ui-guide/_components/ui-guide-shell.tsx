import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

type UIGuideShellProps = {
  children: React.ReactNode
  title?: string
  description?: string
  showBack?: boolean
  className?: string
}

export function UIGuideShell({
  children,
  title,
  description,
  showBack = false,
  className,
}: UIGuideShellProps) {
  return (
    <div className="min-h-screen bg-[#FAF7E6] text-[#1F2E13]">
      <header className="border-b border-[#E0E6D9] bg-[#F4F6F1]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12 lg:px-16">
          <Link href="/ui-guide" className="text-xl font-bold tracking-wide text-[#1F2E13]">
            VIBERA
          </Link>
          <span className="text-sm font-medium text-[#7A6B3F]">UI Component Guide</span>
        </div>
      </header>

      <main className={cn('mx-auto max-w-7xl px-6 py-8 md:px-12 md:py-10 lg:px-16', className)}>
        {showBack && (
          <Link
            href="/ui-guide"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#4B5A41] transition-colors hover:text-[#1F2E13]"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        )}

        {(title || description) && (
          <div className="mb-10 text-center">
            {title && (
              <h1 className="mb-2 text-4xl font-bold text-[#1F2E13] md:text-5xl">{title}</h1>
            )}
            {description && <p className="text-lg text-[#7A6B3F]">{description}</p>}
          </div>
        )}

        {children}
      </main>

      <footer className="border-t border-[#E0E6D9] bg-[#F4F6F1] py-6 text-center text-sm text-[#7A6B3F]">
        Vibera Design System
      </footer>
    </div>
  )
}

export function GuideSection({
  title,
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('mb-10', className)}>
      {title && <h2 className="mb-4 text-2xl font-bold text-[#1F2E13]">{title}</h2>}
      <div className="rounded-xl bg-white p-6 shadow-sm">{children}</div>
    </section>
  )
}
