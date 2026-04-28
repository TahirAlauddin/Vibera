import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

const PUBLIC_PATHS = ['/', '/login', '/signup']

function isPublic(pathname: string) {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/ui-guide')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next()
  }

  const session = await auth()

  if (session) {
    if (pathname === '/dashboard/feed' || pathname.startsWith('/dashboard/feed/')) {
      const feedUrl = new URL(pathname.replace('/dashboard/feed', '/feed'), request.url)
      feedUrl.search = request.nextUrl.search
      return NextResponse.redirect(feedUrl)
    }

    if (pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/home') {
      return NextResponse.redirect(new URL('/feed', request.url))
    }
    return NextResponse.next()
  }

  if (!isPublic(pathname)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)'],
}
