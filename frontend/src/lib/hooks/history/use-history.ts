'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { historyApi } from '@/lib/api/history';
import { useHasToken } from '@/lib/hooks/auth/use-has-token';
import { getCursorNextPageParam } from '@/lib/query/cursor-pagination';

export const HISTORY_KEYS = {
  list: ['history', 'list'] as const,
};

export function useHistory() {
  const hasToken = useHasToken();

  return useInfiniteQuery({
    queryKey: HISTORY_KEYS.list,
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      historyApi.getHistory({
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
