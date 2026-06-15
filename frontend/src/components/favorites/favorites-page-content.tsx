'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useFavorites } from '@/lib/hooks/favorites/use-favorites';
import { useToggleFavorite } from '@/lib/hooks/dictionary/use-dictionary';
import { FavoriteListItem } from '@/components/dictionary/favorite-list-item';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { ListCount } from '@/components/shared/list-count';
import { LoadMoreButton } from '@/components/shared/load-more-button';
import { PageDataLoader } from '@/components/shared/page-data-loader';

export function FavoritesPageContent() {
  const t = useTranslations('favorites');
  const router = useRouter();
  const [removingWord, setRemovingWord] = useState<string | null>(null);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFavorites();
  const { remove } = useToggleFavorite();

  const entries = data?.pages.flatMap((page) => page.results) ?? [];
  const totalDocs = data?.pages[0]?.totalDocs ?? 0;

  const handleRemove = (word: string) => {
    setRemovingWord(word);
    remove.mutate(word, {
      onSettled: () => setRemovingWord(null),
    });
  };

  return (
    <>
      <ListCount count={totalDocs} singular={t('savedWord')} plural={t('savedWords')} />

      {isError && <ErrorState onRetry={refetch} />}

      <PageDataLoader
        isPending={isLoading}
        isFetching={isFetching && !isLoading}
        skeleton="list"
      >
        {entries.length === 0 ? (
          <EmptyState
            title={t('empty')}
            description={t('emptyDescription')}
            icon={<Heart className="h-10 w-10" aria-hidden="true" />}
          />
        ) : (
          <>
            <ul className="space-y-2" aria-label={t('listLabel')}>
              {entries.map((entry) => (
                <FavoriteListItem
                  key={`${entry.word}-${entry.added}`}
                  entry={entry}
                  onSelect={(word) => router.push(`/words/${word}`)}
                  onRemove={handleRemove}
                  isRemoving={removingWord === entry.word}
                />
              ))}
            </ul>

            {hasNextPage && (
              <LoadMoreButton onClick={fetchNextPage} isLoading={isFetchingNextPage} />
            )}
          </>
        )}
      </PageDataLoader>
    </>
  );
}
