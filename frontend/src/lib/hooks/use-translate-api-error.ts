'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { translateApiError } from '@/lib/i18n/translate-api-error';

export function useTranslateApiError() {
  const t = useTranslations('errors');

  return useCallback(
    (error: unknown) => translateApiError(error, t),
    [t],
  );
}
