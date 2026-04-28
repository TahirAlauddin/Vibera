export const DASHBOARD_STATS = [
  { label: 'Total Entries', value: '127', icon: 'calendar' as const },
  { label: 'Day Streak', value: '23', icon: 'trending' as const },
  { label: 'Avg Intensity', value: '7.2', icon: 'heart' as const },
] as const

export const WEEKLY_MOODS = [
  { day: 'Mon', emoji: '😊', mood: 'Happy' },
  { day: 'Tue', emoji: '😌', mood: 'Calm' },
  { day: 'Wed', emoji: '😰', mood: 'Anxious' },
  { day: 'Thu', emoji: '😐', mood: 'Neutral' },
  { day: 'Fri', emoji: '😌', mood: 'Calm' },
  { day: 'Sat', emoji: '😠', mood: 'Angry' },
  { day: 'Sun', emoji: '😊', mood: 'Happy' },
] as const

export const MOOD_DISTRIBUTION = [
  { mood: 'Happy', entries: 51, percent: 40, color: '#F6C531' },
  { mood: 'Calm', entries: 32, percent: 25, color: '#5B9BD5' },
  { mood: 'Neutral', entries: 19, percent: 15, color: '#6B7280' },
  { mood: 'Anxious', entries: 15, percent: 12, color: '#F59E0B' },
  { mood: 'Sad', entries: 6, percent: 5, color: '#D1D5DB' },
  { mood: 'Angry', entries: 4, percent: 3, color: '#EF4444' },
] as const

export const ACHIEVEMENTS = [
  { title: '7-Day Streak', icon: '🔥', unlocked: true },
  { title: 'Mood Master', icon: '⭐', unlocked: true },
  { title: 'Early Bird', icon: '🌅', unlocked: true },
  { title: 'Reflective', icon: '🌙', unlocked: false },
] as const

export const DAILY_REMINDERS = [
  { id: 'morning', title: 'Morning Check-in', time: '9:00 AM', icon: '📅', defaultOn: true },
  { id: 'evening', title: 'Evening Reflection', time: '8:00 PM', icon: '🌙', defaultOn: true },
] as const

export const EXPORT_DATA = {
  stats: DASHBOARD_STATS,
  weeklyMoods: WEEKLY_MOODS,
  moodDistribution: MOOD_DISTRIBUTION,
  exportedAt: new Date().toISOString(),
}
