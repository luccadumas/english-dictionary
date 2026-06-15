'use client';

import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { dictionaryApi } from '@/lib/api/dictionary';
import { HISTORY_KEYS } from '@/lib/hooks/history/use-history';
import { getCursorNextPageParam } from '@/lib/query/cursor-pagination';
import { pollFavoriteStatus } from '@/lib/query/poll-favorite-status';
import { useTranslateApiError } from '@/lib/hooks/use-translate-api-error';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
export const DICTIONARY_KEYS = {
  list: (search?: string) => ['words', 'list', search] as const,
  detail: (word: string) => ['words', 'detail', word] as const,
  isFavorite: (word: string) => ['words', 'isFavorite', word] as const,
};

export function useWordsList(search?: string) {
  return useInfiniteQuery({
    queryKey: DICTIONARY_KEYS.list(search),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      dictionaryApi.listWords({
        search,
        limit: 30,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: getCursorNextPageParam,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });
}

export function useWordDetail(word: string, options?: { enabled?: boolean }) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: DICTIONARY_KEYS.detail(word),
    queryFn: async () => {
      const data = await dictionaryApi.getWordDetails(word);
      void queryClient.invalidateQueries({ queryKey: HISTORY_KEYS.list });
      return data;
    },
    enabled: !!word && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: 'always',
    placeholderData: (previousData) => previousData,
  });
}
export function useIsFavorite(word: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: DICTIONARY_KEYS.isFavorite(word),
    queryFn: () => dictionaryApi.isFavorite(word),
    enabled: !!word && (options?.enabled ?? true),
  });
}

export function useToggleFavorite(word?: string) {
  const t = useTranslations('dictionary');
  const queryClient = useQueryClient();
  const translateApiError = useTranslateApiError();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['favorites'] });
    if (word) {
      await queryClient.invalidateQueries({
        queryKey: DICTIONARY_KEYS.isFavorite(word),
      });
    }
  };

  const add = useMutation({
    mutationFn: dictionaryApi.addFavorite,
    onSuccess: async () => {
      toast.success(t('addedToFavorites'));
      if (word) {
        queryClient.setQueryData(DICTIONARY_KEYS.isFavorite(word), true);
        await pollFavoriteStatus(queryClient, word, true);
      }
      await invalidate();
    },
    onError: (err: Error) => toast.error(translateApiError(err)),
  });

  const remove = useMutation({
    mutationFn: dictionaryApi.removeFavorite,
    onSuccess: async () => {
      toast.success(t('removedFromFavorites'));
      if (word) {
        queryClient.setQueryData(DICTIONARY_KEYS.isFavorite(word), false);
        await pollFavoriteStatus(queryClient, word, false);
      }
      await invalidate();
    },
    onError: (err: Error) => toast.error(translateApiError(err)),
  });

  return { add, remove };
}
