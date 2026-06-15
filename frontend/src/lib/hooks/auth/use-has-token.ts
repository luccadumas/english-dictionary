'use client';

import { useSyncExternalStore } from 'react';
import { getTokenFromCookie } from '@/lib/utils';

function subscribeToToken() {
  return () => {};
}

function getTokenSnapshot() {
  return !!getTokenFromCookie();
}

function getServerTokenSnapshot() {
  return false;
}

export function useHasToken(): boolean {
  return useSyncExternalStore(
    subscribeToToken,
    getTokenSnapshot,
    getServerTokenSnapshot,
  );
}
