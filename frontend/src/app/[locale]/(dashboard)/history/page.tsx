import { asAppLocale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { HistoryPageContent } from '@/components/history/history-page-content';
import { DashboardPage } from '@/components/layout/dashboard-page';

type HistoryPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HistoryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: asAppLocale(locale), namespace: 'metadata' });

  return {
    title: t('historyTitle'),
    description: t('historyDescription'),
  };
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const { locale } = await params;
  setRequestLocale(asAppLocale(locale));
  const t = await getTranslations('history');

  return (
    <DashboardPage>
      <PageHeader title={t('title')} />
      <HistoryPageContent />
    </DashboardPage>
  );
}
