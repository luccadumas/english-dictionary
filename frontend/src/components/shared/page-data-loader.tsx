'use client';

import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { WordCardSkeleton } from '@/components/shared/loading-skeleton';

type PageDataLoaderProps = {
  isPending: boolean;
  isFetching?: boolean;
  skeleton?: 'grid' | 'list' | 'search';
  children: React.ReactNode;
};

export function PageDataLoader({
  isPending,
  isFetching = false,
  skeleton = 'list',
  children,
}: PageDataLoaderProps) {
  const t = useTranslations('common');

  if (isPending) {
    return (
      <div aria-busy="true" aria-label={t('loadingPage')}>
        {skeleton === 'search' ? (
          <div className="space-y-6">
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <WordCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : skeleton === 'grid' ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <WordCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <WordCardSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {isFetching && (
        <div
          className="absolute -top-1 right-0 flex items-center gap-1.5 text-xs text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-3 w-3 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          {t('updating')}
        </div>
      )}
      {children}
    </div>
  );
}
