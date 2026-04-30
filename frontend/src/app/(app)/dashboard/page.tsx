import { DashboardContent } from './_components/dashboard-content'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2E13] sm:text-4xl">Your Dashboard</h1>
        <p className="mt-1 text-base text-[#7A6B3F]">Track your emotional wellness journey</p>
      </header>

      <DashboardContent />
    </div>
  )
}
