'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWordsList } from '@/lib/hooks/dictionary/use-dictionary';
import {
  SEARCH_DEBOUNCE_MS,
  useDebouncedValue,
} from '@/lib/hooks/shared/use-debounce';
import { WordDetailModal } from '@/components/dictionary/word-modal';
import { WordGrid } from '@/components/dictionary/word-grid';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { SearchField } from '@/components/shared/search-field';
import { ListCount } from '@/components/shared/list-count';
import { InfiniteScrollTrigger } from '@/components/shared/infinite-scroll-trigger';
import { PageDataLoader } from '@/components/shared/page-data-loader';

export function DictionaryPageContent() {
  const t = useTranslations('dictionary');
  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const { debouncedValue: debouncedSearch, isDebouncing } = useDebouncedValue(
    search,
    SEARCH_DEBOUNCE_MS,
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWordsList(debouncedSearch || undefined);

  const allWords = data?.pages.flatMap((page) => page.results) ?? [];
  const totalDocs = data?.pages[0]?.totalDocs ?? 0;
  const pagesCount = data?.pages.length ?? 0;

  const isSearching = isDebouncing || (isFetching && !isFetchingNextPage);
  const showResultsLoading = isLoading || isDebouncing;

  return (
    <>
      {!showResultsLoading && (
        <ListCount
          count={totalDocs}
          singular={t('wordAvailable')}
          plural={t('wordsAvailable')}
        />
      )}

      <SearchField
        id="dictionary-filter"
        label={t('filterLabel')}
        value={search}
        onChange={setSearch}
        placeholder={t('filterPlaceholder')}
        isLoading={isSearching}
        loadingLabel={t('loadingWords')}
      />

      {isError && <ErrorState onRetry={refetch} />}

      <PageDataLoader
        isPending={showResultsLoading}
        isFetching={isFetching && !showResultsLoading && !isFetchingNextPage}
        skeleton="grid"
      >
        {allWords.length === 0 ? (
          <EmptyState
            title={t('noResults')}
            description={
              debouncedSearch
                ? t('noResultsFor', { search: debouncedSearch })
                : t('emptyDictionary')
            }
            icon={<BookOpen className="h-10 w-10" aria-hidden="true" />}
          />
        ) : (
          <>
            <WordGrid words={allWords} onWordSelect={setSelectedWord} />
            <InfiniteScrollTrigger
              hasNextPage={!!hasNextPage}
              isFetching={isFetchingNextPage}
              pagesCount={pagesCount}
              resetKey={debouncedSearch}
              onLoadMore={() => fetchNextPage({ cancelRefetch: false })}
            />
          </>
        )}
      </PageDataLoader>

      <WordDetailModal
        word={selectedWord ?? ''}
        open={!!selectedWord}
        onOpenChange={(open) => !open && setSelectedWord(null)}
      />
    </>
  );
}
