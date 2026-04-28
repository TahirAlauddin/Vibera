import { redirect } from 'next/navigation'
import { APP_HOME } from '@/app/(app)/_components/app-nav'

export default function HomePage() {
  redirect(APP_HOME)
}
