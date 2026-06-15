import { asAppLocale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { DictionaryPageContent } from '@/components/dictionary/dictionary-page-content';
import { DashboardPage } from '@/components/layout/dashboard-page';

type DictionaryPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: DictionaryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: asAppLocale(locale), namespace: 'metadata' });

  return {
    title: t('dictionaryTitle'),
    description: t('dictionaryDescription'),
  };
}

export default async function DictionaryPage({ params }: DictionaryPageProps) {
  const { locale } = await params;
  setRequestLocale(asAppLocale(locale));
  const t = await getTranslations('dictionary');

  return (
    <DashboardPage>
      <PageHeader title={t('pageTitle')} />
      <DictionaryPageContent />
    </DashboardPage>
  );
}
