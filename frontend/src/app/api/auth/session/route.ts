import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants';
import { getBackendApiUrl } from '@/lib/server/backend-url';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const backendResponse = await fetch(`${getBackendApiUrl()}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!backendResponse.ok) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true });
}
