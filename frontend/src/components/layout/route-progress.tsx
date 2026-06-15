'use client';

import { useEffect, useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useNavigationPending } from '@/components/providers/navigation-pending-provider';

export function RouteProgress() {
  const pathname = usePathname();
  const { isNavigating } = useNavigationPending();
  const fetchingCount = useIsFetching({
    predicate: (query) =>
      query.state.status === 'pending' || query.state.fetchStatus === 'fetching',
  });
  const [isPathChanging, setIsPathChanging] = useState(false);

  useEffect(() => {
    setIsPathChanging(true);
    const timer = window.setTimeout(() => setIsPathChanging(false), 300);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const isActive = isNavigating || isPathChanging || fetchingCount > 0;

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden',
        isActive ? 'opacity-100' : 'opacity-0 transition-opacity duration-200',
      )}
      role="progressbar"
      aria-hidden={!isActive}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          'route-progress-bar h-full bg-brand',
          isActive && 'animate-route-progress',
        )}
      />
    </div>
  );
}
