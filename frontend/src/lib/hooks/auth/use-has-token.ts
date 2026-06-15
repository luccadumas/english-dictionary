'use client';

import { useQuery } from '@tanstack/react-query';

export const SESSION_KEY = ['auth', 'session'] as const;

async function fetchSession(): Promise<{ authenticated: boolean }> {
  const res = await fetch('/api/auth/session', { credentials: 'include' });
  if (!res.ok) return { authenticated: false };
  return res.json() as Promise<{ authenticated: boolean }>;
}

export function useHasToken(): boolean {
  const { data } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: fetchSession,
    staleTime: 60_000,
  });

  return data?.authenticated ?? false;
}
