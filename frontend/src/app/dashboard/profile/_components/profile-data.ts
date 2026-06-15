export const COVER_IMAGE_URL =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=200&fit=crop&q=80'

export const PROFILE_MENU = [
  { id: 'profile', label: 'Profile', href: '/dashboard/profile' },
  { id: 'journal', label: 'Write Journal', href: '#', icon: 'book' as const },
  { id: 'analytics', label: 'View Analytics', href: '#', icon: 'chart' as const },
] as const

export const RECENT_MESSAGES = [
  {
    id: '1',
    name: 'Arjun Patel',
    message: 'Hey, how are you feeling today?',
    time: '4 hours ago',
    avatar: 'https://i.pravatar.cc/80?u=arjun',
  },
  {
    id: '2',
    name: 'Maya Lin',
    message: 'Loved your latest mood entry!',
    time: '6 hours ago',
    avatar: 'https://i.pravatar.cc/80?u=maya',
  },
  {
    id: '3',
    name: 'Elena Rossi',
    message: 'Sending positive vibes your way',
    time: '1 day ago',
    avatar: 'https://i.pravatar.cc/80?u=elena',
  },
] as const

export const SUGGESTED_FOLLOWERS = [
  {
    id: '1',
    name: 'Arjun Patel',
    handle: '@arjunp',
    avatar: 'https://i.pravatar.cc/80?u=arjun2',
  },
  {
    id: '2',
    name: 'Maya Lin',
    handle: '@mayal',
    avatar: 'https://i.pravatar.cc/80?u=maya2',
  },
  {
    id: '3',
    name: 'Elena Rossi',
    handle: '@elenar',
    avatar: 'https://i.pravatar.cc/80?u=elena2',
  },
  {
    id: '4',
    name: 'James Carter',
    handle: '@jamesc',
    avatar: 'https://i.pravatar.cc/80?u=james',
  },
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
