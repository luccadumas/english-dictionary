'use client';

import { useTranslations } from 'next-intl';
import { ErrorState } from '@/components/shared/error-state';

export default function DashboardError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations('errors');

  return <ErrorState message={t('pageLoad')} onRetry={reset} />;
}
