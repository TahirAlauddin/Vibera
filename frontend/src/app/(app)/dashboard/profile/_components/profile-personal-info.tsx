'use client'

import Image from 'next/image'
import { Pencil } from 'lucide-react'

type ProfilePersonalInfoProps = {
  username: string
  avatarUrl: string
  onUsernameChange: (value: string) => void
}

export function ProfilePersonalInfo({
  username,
  avatarUrl,
  onUsernameChange,
}: ProfilePersonalInfoProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-[#1F2E13]">Personal Information</h2>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-[#F4F6F1]">
          <Image src={avatarUrl} alt="Profile" fill className="object-cover" sizes="64px" />
          <button
            type="button"
            className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-[#F6C531] text-[#1F2E13] shadow-sm transition-colors hover:bg-[#E0B42D]"
            aria-label="Edit profile photo"
          >
            <Pencil className="size-3.5" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-[#1F2E13]">Profile photo</p>
          <p className="text-xs text-[#7A6B3F]">JPG or PNG. Max 2MB.</p>
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-[#4B5A41]">Username</span>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="w-full rounded-xl border border-[#E0E6D9] bg-[#FAF7E6] px-4 py-2.5 text-sm text-[#1F2E13] outline-none transition focus:border-[#F6C531] focus:ring-2 focus:ring-[#F6C531]/30"
        />
      </label>
    </section>
  )
}
