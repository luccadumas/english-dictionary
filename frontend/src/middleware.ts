import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const AUTH_ROUTES = ['/login', '/register'] as const;

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
