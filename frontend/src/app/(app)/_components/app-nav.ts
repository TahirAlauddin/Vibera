export const APP_HOME = '/feed'

export type NavLink = {
  href: string
  label: string
}

/** Feed is the logged-in home — social hub */
export const FEED_NAV_LINKS: NavLink[] = [
  { href: APP_HOME, label: 'Feed' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/profile', label: 'Profile' },
]

/** Dashboard area — insights and mood tracking */
export const DASHBOARD_NAV_LINKS: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/mood-tracker', label: 'Mood Tracker' },
  { href: '/dashboard/profile', label: 'Profile' },
]

/** Profile page — bridge between feed and dashboard areas */
export const PROFILE_NAV_LINKS: NavLink[] = [
  { href: APP_HOME, label: 'Feed' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/mood-tracker', label: 'Mood Tracker' },
  { href: '/dashboard/profile', label: 'Profile' },
]

export function getPrimaryNavLinks(pathname: string): NavLink[] {
  if (pathname === APP_HOME || pathname.startsWith('/feed/')) return FEED_NAV_LINKS
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/mood-tracker')) {
    return DASHBOARD_NAV_LINKS
  }
  if (pathname.startsWith('/dashboard/profile')) return PROFILE_NAV_LINKS
  return FEED_NAV_LINKS
}

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard'
  if (href === APP_HOME) return pathname === APP_HOME || pathname.startsWith('/feed/')
  if (href === '/dashboard/mood-tracker') return pathname.startsWith('/dashboard/mood-tracker')
  if (href === '/dashboard/profile') return pathname.startsWith('/dashboard/profile')
  return pathname === href || pathname.startsWith(`${href}/`)
}
