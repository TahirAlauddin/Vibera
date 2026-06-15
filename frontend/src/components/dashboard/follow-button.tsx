'use client'

import { cn } from '@/lib/utils'

type FollowButtonProps = {
  isFollowing: boolean
  loading?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  onClick: () => void
  className?: string
}

export function FollowButton({
  isFollowing,
  loading = false,
  disabled = false,
  size = 'sm',
  onClick,
  className,
}: FollowButtonProps) {
  const sizeClasses = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-lg font-semibold transition-colors disabled:opacity-50',
        sizeClasses,
        isFollowing
          ? 'bg-[#F4F6F1] text-[#4B5A41] ring-1 ring-[#E0E6D9] hover:bg-[#E8EDE3]'
          : 'bg-[#F6C531] text-[#1F2E13] hover:bg-[#E0B42D]',
        className
      )}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
