import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to protect routes and handle authentication redirects
 * 
 * Public routes: /login, /signup
 * Protected routes: All other routes (except public assets)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Check for access token in cookies (if using httpOnly cookies)
  // For now, we'll check localStorage via client-side, but middleware can check cookies
  // Since we're using localStorage, the actual protection happens client-side
  // This middleware can be extended to check httpOnly cookies if needed

  // Allow public routes and static files
  if (isPublicRoute || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/assets')) {
    return NextResponse.next()
  }

  // For protected routes, we'll let the client-side handle redirects
  // since we're using localStorage (not accessible in middleware)
  // In production with httpOnly cookies, you would check the cookie here
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
