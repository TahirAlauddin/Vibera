import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type DashboardCardProps = {
  title: string
  description: string
  href: string
  preview: React.ReactNode
  className?: string
}

export function DashboardCard({ title, description, href, preview, className }: DashboardCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col rounded-xl bg-white p-6 shadow-sm transition-all',
        'hover:shadow-md hover:ring-2 hover:ring-[#F6C531]/40',
        className
      )}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#1F2E13]">{title}</h2>
        <p className="mt-1 text-sm text-[#7A6B3F]">{description}</p>
      </div>

      <div className="mb-6 flex min-h-[120px] flex-1 items-center justify-center rounded-lg border border-[#E0E6D9] bg-[#F4F6F1] p-4">
        {preview}
      </div>

      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#4B5A41] transition-colors group-hover:text-[#1F2E13]">
        View full guide
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
