'use client';

import { History } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { TimestampedWordEntry } from '@/types/word-list.types';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { SectionTitle } from '@/components/shared/section-title';
import { WordCardGridItem } from '@/components/dictionary/word-card-grid-item';

interface RecentSearchesSectionProps {
  entries: TimestampedWordEntry[];
  isError: boolean;
  onRetry: () => void;
}

export function RecentSearchesSection({
  entries,
  isError,
  onRetry,
}: RecentSearchesSectionProps) {
  const t = useTranslations('history');
  const router = useRouter();

  return (
    <section aria-labelledby="recent-searches-heading">
      <SectionTitle id="recent-searches-heading">{t('recentSearches')}</SectionTitle>

      {isError ? (
        <ErrorState onRetry={onRetry} message={t('loadFailed')} />
      ) : entries.length === 0 ? (
        <EmptyState
          title={t('noSearchesYet')}
          description={t('noSearchesDescription')}
          icon={<History className="h-10 w-10" aria-hidden="true" />}
        />
      ) : (
        <ul
          className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
          aria-label={t('recentListLabel')}
        >
          {entries.map((entry) => (
            <WordCardGridItem
              key={`${entry.word}-${entry.added}`}
              entry={entry}
              onSelect={(word) => router.push(`/words/${word}`)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
