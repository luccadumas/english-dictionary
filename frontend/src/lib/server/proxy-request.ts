import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants';
import { getBackendApiUrl } from '@/lib/server/backend-url';

const FORWARD_RESPONSE_HEADERS = [
  'content-type',
  'x-cache',
  'x-response-time',
  'x-request-id',
] as const;

export async function proxyToBackend(
  request: NextRequest,
  pathSegments: string[],
): Promise<NextResponse> {
  const backendUrl = getBackendApiUrl();
  const path = pathSegments.join('/');
  const search = request.nextUrl.search;
  const url = `${backendUrl}/${path}${search}`;

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const headers = new Headers();

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const accept = request.headers.get('accept');
  if (accept) headers.set('Accept', accept);

  if (token) headers.set('Authorization', `Bearer ${token}`);

  const requestId = request.headers.get('x-request-id');
  if (requestId) headers.set('x-request-id', requestId);

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const backendResponse = await fetch(url, {
    method: request.method,
    headers,
    body: body?.byteLength ? body : undefined,
    cache: 'no-store',
  });

  const responseHeaders = new Headers();
  for (const header of FORWARD_RESPONSE_HEADERS) {
    const value = backendResponse.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}
