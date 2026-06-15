'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { favoritesApi } from '@/lib/api/favorites';
import { useHasToken } from '@/lib/hooks/auth/use-has-token';
import { getCursorNextPageParam } from '@/lib/query/cursor-pagination';

export const FAVORITES_KEYS = {
  list: ['favorites', 'list'] as const,
};

export function useFavorites() {
  const hasToken = useHasToken();

  return useInfiniteQuery({
    queryKey: FAVORITES_KEYS.list,
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      favoritesApi.getFavorites({
        limit: 20,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: getCursorNextPageParam,
    enabled: hasToken,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}
