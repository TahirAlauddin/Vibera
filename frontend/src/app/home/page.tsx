import { redirect } from 'next/navigation'
import { APP_HOME } from '@/app/dashboard/_components/dashboard-nav'

export default function HomePage() {
  redirect(APP_HOME)
}
