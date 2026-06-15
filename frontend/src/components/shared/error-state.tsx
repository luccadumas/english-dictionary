'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ message, onRetry, retryLabel }: ErrorStateProps) {
  const t = useTranslations('errors');
  const tCommon = useTranslations('common');
  const displayMessage = message ?? t('generic');
  const actionLabel = retryLabel ?? tCommon('tryAgain');

  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-base font-medium text-destructive">{displayMessage}</p>
      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          className="mt-4"
          aria-label={actionLabel}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
