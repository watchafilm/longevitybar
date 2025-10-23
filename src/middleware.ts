import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true'
  const { pathname } = request.nextUrl

  const isLoginPage = pathname === '/login'

  // If the user is authenticated
  if (isAuthenticated) {
    // If they are on the login page, redirect to home
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Otherwise, allow them to proceed
    return NextResponse.next()
  }

  // If the user is NOT authenticated
  // and they are NOT on the login page, redirect to login
  if (!isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If they are on the login page, allow them to proceed
  return NextResponse.next()
}

export const config = {
  // Matcher to specify which routes the middleware should run on.
  // We exclude api routes, static files, and image optimization routes.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
