export const COVER_IMAGE_URL =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=200&fit=crop&q=80'

export const PROFILE_MENU = [
  { id: 'profile', label: 'Profile', href: '/dashboard/profile' },
  { id: 'journal', label: 'Write Journal', href: '/dashboard/mood-tracker', icon: 'book' as const },
  { id: 'analytics', label: 'View Analytics', href: '/dashboard', icon: 'chart' as const },
] as const

export const SECURITY_SETTINGS = [
  {
    id: 'password',
    title: 'Change Password',
    description: 'Update your password regularly for better security',
  },
  {
    id: '2fa',
    title: 'Two-factor authentication',
    description: 'Add an extra layer of security to your account',
    defaultOn: true,
  },
  {
    id: 'notifications',
    title: 'Notification preferences',
    description: 'Manage email and push notification settings',
    defaultOn: true,
  },
  {
    id: 'privacy',
    title: 'Privacy settings',
    description: 'Control who can see your mood entries',
    defaultOn: false,
  },
] as const
