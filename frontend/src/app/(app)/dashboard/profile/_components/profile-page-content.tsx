'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { fetchMyMoods } from '@/lib/mood-api'
import {
  fetchCurrentUser,
  fetchMyProfile,
  updateCurrentUser,
} from '@/lib/profile-api'
import { fetchSocialStats } from '@/lib/social-api'
import { getAvatarUrl } from '@/lib/mood-api'
import type { MoodEntry } from '@/lib/mood-api'
import { ProfileHeader } from './profile-header'
import { ProfileStatCards } from './profile-stat-cards'
import { ProfilePersonalInfo } from './profile-personal-info'
import { ProfileSecuritySettings } from './profile-security-settings'
import { ProfileContactInfo } from './profile-contact-info'
import { ProfileSidebar } from './profile-sidebar'
import { getProfileStats, getRecentActivity } from './profile-stats-utils'

function getDisplayName(firstName?: string, lastName?: string, username?: string) {
  const name = [firstName, lastName].filter(Boolean).join(' ').trim()
  return name || username || 'Vibera User'
}

export function ProfilePageContent() {
  const { data: session, status } = useSession()
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [friendsCount, setFriendsCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const accessToken = session?.accessToken

  useEffect(() => {
    if (status !== 'authenticated' || !accessToken) return

    let cancelled = false

    async function loadProfile() {
      try {
        const [user, stats, profile, moods] = await Promise.all([
          fetchCurrentUser(accessToken!),
          fetchSocialStats(accessToken!),
          fetchMyProfile(accessToken!),
          fetchMyMoods(accessToken!),
        ])

        if (cancelled) return

        setUsername(user.username)
        setEmail(user.email)
        setFirstName(user.first_name ?? '')
        setLastName(user.last_name ?? '')
        setFullName(getDisplayName(user.first_name, user.last_name, user.username))
        setFollowers(stats.followers_count)
        setFollowing(stats.following_count)
        setFriendsCount(stats.friends_count)
        setAvatarUrl(getAvatarUrl(user.username, profile.avatar))
        setMoodEntries(moods.results ?? [])
      } catch {
        if (!cancelled) {
          const fallbackUsername = session?.user?.username ?? 'vibera'
          setUsername(fallbackUsername)
          setEmail(session?.user?.email ?? '')
          setFullName(session?.user?.name ?? fallbackUsername)
          setAvatarUrl(getAvatarUrl(fallbackUsername))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadProfile()
    return () => {
      cancelled = true
    }
  }, [status, accessToken, session])

  const profileStats = useMemo(
    () =>
      getProfileStats(moodEntries, {
        followers_count: followers,
        following_count: following,
        friends_count: friendsCount,
      }),
    [moodEntries, followers, following, friendsCount]
  )

  const recentActivity = useMemo(() => getRecentActivity(moodEntries), [moodEntries])

  const handleSave = async () => {
    if (!accessToken) return

    setIsSaving(true)
    try {
      const nameParts = fullName.trim().split(/\s+/)
      const nextFirst = nameParts[0] ?? ''
      const nextLast = nameParts.slice(1).join(' ')

      await updateCurrentUser(accessToken, {
        username: username.trim(),
        email: email.trim(),
        first_name: nextFirst,
        last_name: nextLast,
      })

      setFirstName(nextFirst)
      setLastName(nextLast)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFullName(getDisplayName(firstName, lastName, username))
    toast.message('Changes discarded')
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-[#7A6B3F] sm:px-6 lg:px-8">
        Loading profile...
      </div>
    )
  }

  const displayName = getDisplayName(firstName, lastName, username)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileHeader
            displayName={displayName}
            username={username}
            followers={followers}
            following={following}
            avatarUrl={avatarUrl}
          />

          <ProfileStatCards stats={profileStats} />

          <ProfilePersonalInfo
            username={username}
            avatarUrl={avatarUrl}
            onUsernameChange={setUsername}
          />

          <ProfileSecuritySettings />

          <ProfileContactInfo
            fullName={fullName}
            email={email}
            phone={phone}
            onFullNameChange={setFullName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-[#91B6A2] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7BA38E] disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-xl bg-[#FEE2E2] px-6 py-2.5 text-sm font-semibold text-[#DC2626] transition-colors hover:bg-[#FECACA] disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>

        <ProfileSidebar
          accessToken={accessToken!}
          recentActivity={recentActivity}
          onStatsChange={({ followers: f, following: g, friends }) => {
            setFollowers(f)
            setFollowing(g)
            setFriendsCount(friends)
          }}
        />
      </div>
    </div>
  )
}
