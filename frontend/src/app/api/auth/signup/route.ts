import { NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/lib/server/backend-url';
import { setAuthCookie } from '@/lib/server/auth-cookie';

export async function POST(request: Request) {
  const payload = await request.json();
  const backendResponse = await fetch(`${getBackendApiUrl()}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data = await backendResponse.json().catch(() => ({}));

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  const response = NextResponse.json({
    id: data.id,
    name: data.name,
  });
  setAuthCookie(response, data.token);
  return response;
}
