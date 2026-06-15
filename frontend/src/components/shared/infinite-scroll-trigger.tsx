'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface InfiniteScrollTriggerProps {
  hasNextPage: boolean;
  isFetching: boolean;
  pagesCount: number;
  resetKey?: string;
  onLoadMore: () => void;
}

export function InfiniteScrollTrigger({
  hasNextPage,
  isFetching,
  pagesCount,
  resetKey,
  onLoadMore,
}: InfiniteScrollTriggerProps) {
  const t = useTranslations('common');
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingRef = useRef(isFetching);
  const pagesCountRef = useRef(pagesCount);
  const onLoadMoreRef = useRef(onLoadMore);
  const wasIntersectingRef = useRef(false);
  const requestedAtPagesRef = useRef<number | null>(null);

  hasNextPageRef.current = hasNextPage;
  isFetchingRef.current = isFetching;
  pagesCountRef.current = pagesCount;
  onLoadMoreRef.current = onLoadMore;

  const tryLoadMore = () => {
    if (!hasNextPageRef.current || isFetchingRef.current) return;

    const currentPages = pagesCountRef.current;
    if (requestedAtPagesRef.current === currentPages) return;

    requestedAtPagesRef.current = currentPages;
    onLoadMoreRef.current();
  };

  useEffect(() => {
    requestedAtPagesRef.current = null;
    wasIntersectingRef.current = false;
  }, [resetKey]);

  useEffect(() => {
    requestedAtPagesRef.current = null;
  }, [pagesCount]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry?.isIntersecting ?? false;

        // Only load when the sentinel ENTERS the viewport (user scrolled down),
        // not when it was already visible (avoids auto-chain after search).
        if (isIntersecting && !wasIntersectingRef.current) {
          tryLoadMore();
        }

        wasIntersectingRef.current = isIntersecting;
      },
      { rootMargin: '0px 0px 200px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={sentinelRef}
      className="py-4 text-center"
      aria-live="polite"
      aria-busy={isFetching}
    >
      {isFetching && (
        <p className="text-sm text-muted-foreground">{t('loadMoreWords')}</p>
      )}
    </div>
  );
}
