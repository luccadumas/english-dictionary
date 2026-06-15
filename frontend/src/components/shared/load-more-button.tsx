'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function LoadMoreButton({
  onClick,
  isLoading = false,
  disabled = false,
}: LoadMoreButtonProps) {
  const t = useTranslations('common');

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? t('loading') : t('loadMore')}
    </Button>
  );
}
