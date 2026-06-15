'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { SearchField } from '@/components/shared/search-field';

interface WordSearchNavigatorProps {
  id?: string;
  size?: 'default' | 'lg';
}

export function WordSearchNavigator({
  id = 'word-search',
  size = 'lg',
}: WordSearchNavigatorProps) {
  const t = useTranslations('dictionary');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSubmit = () => {
    const trimmed = search.trim();
    if (trimmed) {
      router.push(`/words/${encodeURIComponent(trimmed.toLowerCase())}`);
    }
  };

  return (
    <SearchField
      id={id}
      label={t('searchLabel')}
      value={search}
      onChange={setSearch}
      onSubmit={handleSubmit}
      placeholder={t('searchPlaceholder')}
      submitLabel={tCommon('search')}
      size={size}
    />
  );
}
