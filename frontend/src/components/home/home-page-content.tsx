'use client';

import { useHistory } from '@/lib/hooks/history/use-history';
import { WordSearchNavigator } from '@/components/dictionary/word-search-navigator';
import { RecentSearchesSection } from '@/components/home/recent-searches-section';
import { PageDataLoader } from '@/components/shared/page-data-loader';

export function HomePageContent() {
  const { data, isLoading, isFetching, isError, refetch } = useHistory();
  const recentHistory = data?.pages[0]?.results.slice(0, 10) ?? [];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border/80 brand-gradient-soft p-6 shadow-card md:p-8">
        <WordSearchNavigator id="home-search" size="lg" />
      </div>
      <PageDataLoader
        isPending={isLoading}
        isFetching={isFetching && !isLoading}
        skeleton="search"
      >
        <RecentSearchesSection
          entries={recentHistory}
          isError={isError}
          onRetry={refetch}
        />
      </PageDataLoader>
    </div>
  );
}
