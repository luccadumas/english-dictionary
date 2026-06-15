'use client';

import { History } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useHistory } from '@/lib/hooks/history/use-history';
import { WordListItem } from '@/components/dictionary/word-list-item';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { ListCount } from '@/components/shared/list-count';
import { LoadMoreButton } from '@/components/shared/load-more-button';
import { PageDataLoader } from '@/components/shared/page-data-loader';

export function HistoryPageContent() {
  const t = useTranslations('history');
  const router = useRouter();
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHistory();

  const entries = data?.pages.flatMap((page) => page.results) ?? [];
  const totalDocs = data?.pages[0]?.totalDocs ?? 0;

  return (
    <>
      <ListCount count={totalDocs} singular={t('wordVisited')} plural={t('wordsVisited')} />

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
            icon={<History className="h-10 w-10" aria-hidden="true" />}
          />
        ) : (
          <>
            <ul className="space-y-2" aria-label={t('listLabel')}>
              {entries.map((entry) => (
                <WordListItem
                  key={`${entry.word}-${entry.added}`}
                  entry={entry}
                  onSelect={(word) => router.push(`/words/${word}`)}
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
