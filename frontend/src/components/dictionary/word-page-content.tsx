'use client';

import { BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import {
  useWordDetail,
  useToggleFavorite,
  useIsFavorite,
} from '@/lib/hooks/dictionary/use-dictionary';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { BackLink } from '@/components/shared/back-link';
import { WordDetail } from '@/components/dictionary/word-detail';
import { PageDataLoader } from '@/components/shared/page-data-loader';

interface WordPageContentProps {
  word: string;
}

export function WordPageContent({ word }: WordPageContentProps) {
  const t = useTranslations('dictionary');
  const router = useRouter();
  const { data: entries, isLoading, isFetching, isError } = useWordDetail(word);
  const { data: isFavorite, isLoading: isFavoriteLoading } = useIsFavorite(word);
  const { add, remove } = useToggleFavorite(word);

  const entry = entries?.[0];
  const hasDefinitions = (entry?.meanings?.length ?? 0) > 0;

  return (
    <article aria-labelledby="word-heading">
      <BackLink />

      {isError && (
        <ErrorState
          message={t('wordNotFound', { word })}
          retryLabel={t('tryAnotherWord')}
          onRetry={() => router.push('/')}
        />
      )}

      <PageDataLoader
        isPending={isLoading}
        isFetching={isFetching && !isLoading}
        skeleton="list"
      >
        {entry && !hasDefinitions && (
          <EmptyState
            title={t('noDefinitionAvailable', { word })}
            description={t('noDefinitionDescription')}
            icon={<BookOpen className="h-10 w-10" aria-hidden="true" />}
          />
        )}
        {entry && hasDefinitions && (
          <WordDetail
            entry={entry}
            headingId="word-heading"
            onAddFavorite={
              !isFavoriteLoading && !isFavorite ? () => add.mutate(word) : undefined
            }
            onRemoveFavorite={
              isFavoriteLoading || !isFavorite ? undefined : () => remove.mutate(word)
            }
            isFavoriting={add.isPending || remove.isPending}
          />
        )}
      </PageDataLoader>
    </article>
  );
}
