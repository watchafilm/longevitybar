import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true'
  const { pathname } = request.nextUrl

  // Allow access to the login page regardless of authentication status
  if (pathname.startsWith('/login')) {
    // If the user is already authenticated and tries to access login, redirect to home
    if (isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is authenticated, allow them to proceed
  return NextResponse.next()
}

export const config = {
  // Matcher to specify which routes the middleware should run on.
  // We exclude api routes, static files, and image optimization routes.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
