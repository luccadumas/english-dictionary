import type { QueryClient } from '@tanstack/react-query';
import { dictionaryApi } from '@/lib/api/dictionary';
import { favoritesApi } from '@/lib/api/favorites';
import { historyApi } from '@/lib/api/history';
import { DICTIONARY_KEYS } from '@/lib/hooks/dictionary/use-dictionary';
import { FAVORITES_KEYS } from '@/lib/hooks/favorites/use-favorites';
import { HISTORY_KEYS } from '@/lib/hooks/history/use-history';
import { getCursorNextPageParam } from '@/lib/query/cursor-pagination';
import { getTokenFromCookie } from '@/lib/utils';

const LIST_LIMIT = 20;

export type AppRoute = '/' | '/dictionary' | '/history' | '/favorites';

function canPrefetchAuthRoute(href: AppRoute) {
  if (href === '/dictionary') return true;
  return typeof window !== 'undefined' && !!getTokenFromCookie();
}

export async function prefetchRoute(queryClient: QueryClient, href: AppRoute) {
  if (!canPrefetchAuthRoute(href)) return;

  switch (href) {
    case '/':
    case '/history':
      await queryClient.prefetchInfiniteQuery({
        queryKey: HISTORY_KEYS.list,
        queryFn: ({ pageParam }) =>
          historyApi.getHistory({ limit: LIST_LIMIT, cursor: pageParam }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: getCursorNextPageParam,
        pages: 1,
      });
      break;
    case '/dictionary':
      await queryClient.prefetchInfiniteQuery({
        queryKey: DICTIONARY_KEYS.list(undefined),
        queryFn: ({ pageParam }) =>
          dictionaryApi.listWords({ limit: 30, cursor: pageParam }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: getCursorNextPageParam,
        pages: 1,
      });
      break;
    case '/favorites':
      await queryClient.prefetchInfiniteQuery({
        queryKey: FAVORITES_KEYS.list,
        queryFn: ({ pageParam }) =>
          favoritesApi.getFavorites({ limit: LIST_LIMIT, cursor: pageParam }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: getCursorNextPageParam,
        pages: 1,
      });
      break;
  }
}
