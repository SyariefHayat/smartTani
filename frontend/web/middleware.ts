import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_KEYS } from './lib/cookies';

const protectedPaths = ['/admin', '/dashboard', '/proposals', '/orders', '/portfolio', '/shipments'];
const guestPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const role = request.cookies.get(COOKIE_KEYS.USER_ROLE)?.value;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isGuestOnly = guestPaths.some((path) => pathname.startsWith(path));

  // 1. Redirect unauthenticated users to login
  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Redirect authenticated users away from guest pages
  if (isGuestOnly && token) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (role === 'logistik') {
      return NextResponse.redirect(new URL('/shipments', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. Role-based access control for /admin
  if (pathname.startsWith('/admin') && role !== 'admin') {
    // If authenticated but not admin, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. Role-based access control for /shipments
  if (pathname.startsWith('/shipments') && role !== 'logistik' && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
