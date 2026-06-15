'use client';

import { DashboardPageSkeleton } from '@/components/shared/dashboard-page-skeleton';
import { useNavigationPending } from '@/components/providers/navigation-pending-provider';

export function DashboardMain({ children }: { children: React.ReactNode }) {
  const { isNavigating } = useNavigationPending();

  if (isNavigating) {
    return <DashboardPageSkeleton />;
  }

  return children;
}
