import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { FriendsPageContent } from './_components/friends-page-content'

export default function FriendsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-[#7A6B3F]">
          <Loader2 className="mr-2 size-5 animate-spin" />
          Loading...
        </div>
      }
    >
      <FriendsPageContent />
    </Suspense>
  )
}
