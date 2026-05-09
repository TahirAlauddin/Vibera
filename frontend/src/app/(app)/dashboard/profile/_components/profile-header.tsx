import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import { COVER_IMAGE_URL } from './profile-data'

type ProfileHeaderProps = {
  displayName: string
  username: string
  followers: number
  following: number
  avatarUrl: string
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return n.toString()
}

export function ProfileHeader({
  displayName,
  username,
  followers,
  following,
  avatarUrl,
}: ProfileHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative h-24 sm:h-28">
        <Image
          src={COVER_IMAGE_URL}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 800px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="px-5 pb-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="-mt-10 shrink-0">
            <div className="relative size-20 overflow-hidden rounded-full border-4 border-white bg-[#F4F6F1] shadow-md sm:size-24">
              <Image src={avatarUrl} alt={displayName} fill className="object-cover" sizes="96px" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-[#1F2E13] sm:text-2xl">{displayName}</h1>
              <BadgeCheck className="size-5 text-[#5B9BD5]" aria-label="Verified" />
            </div>
            <p className="text-sm text-[#7A6B3F]">@{username}</p>
            <p className="mt-2 text-sm text-[#4B5A41]">
              <Link href="/friends?tab=followers" className="hover:underline">
                <span className="font-semibold text-[#1F2E13]">{formatCount(followers)}</span>{' '}
                followers
              </Link>
              {' · '}
              <Link href="/friends?tab=following" className="hover:underline">
                <span className="font-semibold text-[#1F2E13]">{formatCount(following)}</span>{' '}
                following
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
