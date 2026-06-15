'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

interface BackLinkProps {
  href?: string;
  label?: string;
}

export function BackLink({ href = '/', label }: BackLinkProps) {
  const t = useTranslations('common');
  const displayLabel = label ?? t('back');

  return (
    <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
      <Link href={href} aria-label={t('backToHome')}>
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
        {displayLabel}
      </Link>
    </Button>
  );
}
