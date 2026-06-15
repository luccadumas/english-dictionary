'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded bg-muted', className)}
      aria-hidden="true"
    />
  );
}

export function WordCardSkeleton() {
  return (
    <div
      className="space-y-2 rounded-lg border border-border bg-card p-4"
      aria-hidden="true"
    >
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function WordDetailSkeleton() {
  const t = useTranslations('common');

  return (
    <div
      className="space-y-6"
      aria-hidden="true"
      aria-label={t('loadingWordDetails')}
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}
