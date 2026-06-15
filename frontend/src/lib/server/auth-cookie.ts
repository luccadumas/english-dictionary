import type { NextResponse } from 'next/server';
import { AUTH_COOKIE_MAX_AGE, AUTH_TOKEN_COOKIE } from '@/lib/auth/constants';

export function setAuthCookie(response: NextResponse, token: string): void {
  const clean = token.replace(/^Bearer\s+/i, '');
  response.cookies.set(AUTH_TOKEN_COOKIE, clean, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
