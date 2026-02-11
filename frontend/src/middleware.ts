import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

/**
 * Middleware to protect routes and handle authentication redirects
 *
 * Public routes: /, /login, /signup, /ui/button, /ui/inputbox, /ui-guide, /color-palette
 * Protected routes: All other routes (except public assets)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  // Use exact matching for root and prefix matching for others
  const publicRoutes = ['/', '/login', '/signup', '/ui/button', '/ui/inputbox', '/ui-guide', '/color-palette']
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/ui/button' ||
    pathname === '/ui/inputbox' ||
    pathname === '/ui-guide' ||
    pathname === '/color-palette' ||
    pathname.startsWith('/login/') ||
    pathname.startsWith('/signup/') ||
    pathname.startsWith('/ui/button/') ||
    pathname.startsWith('/ui/inputbox/') ||
    pathname.startsWith('/ui-guide/') ||
    pathname.startsWith('/color-palette/')

  // Allow public routes and static files
  if (
    isPublicRoute ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const session = await auth()

  // If not authenticated and trying to access protected route, redirect to login
  if (!session && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated and trying to access login/signup, redirect to home
  if (
    session &&
    isPublicRoute &&
    (pathname.startsWith('/login') || pathname.startsWith('/signup'))
  ) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

/**
 * Configure which routes should run the middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
}
