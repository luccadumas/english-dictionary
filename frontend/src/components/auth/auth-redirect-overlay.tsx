'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/providers/auth-provider';
import { LoadingOverlay } from '@/components/shared/loading-overlay';

export function AuthRedirectOverlay() {
  const t = useTranslations('auth');
  const { isRedirecting } = useAuth();

  if (!isRedirecting) return null;

  return <LoadingOverlay label={t('redirecting')} />;
}
