import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_KEYS } from './lib/cookies';
import { getRoleHomePath } from './lib/role-routes';

const protectedPaths = ['/admin', '/dashboard', '/proposals', '/orders', '/portfolio', '/shipments'];
const guestPaths = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const role = request.cookies.get(COOKIE_KEYS.USER_ROLE)?.value;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isGuestOnly = guestPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (isGuestOnly && token) {
    return NextResponse.redirect(new URL(getRoleHomePath(role), request.url));
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL(getRoleHomePath(role), request.url));
  }

  if (pathname.startsWith('/shipments') && role !== 'logistik' && role !== 'admin') {
    return NextResponse.redirect(new URL(getRoleHomePath(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
