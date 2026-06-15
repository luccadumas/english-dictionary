import { asAppLocale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { FavoritesPageContent } from '@/components/favorites/favorites-page-content';
import { DashboardPage } from '@/components/layout/dashboard-page';

type FavoritesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: FavoritesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: asAppLocale(locale), namespace: 'metadata' });

  return {
    title: t('favoritesTitle'),
    description: t('favoritesDescription'),
  };
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { locale } = await params;
  setRequestLocale(asAppLocale(locale));
  const t = await getTranslations('favorites');

  return (
    <DashboardPage>
      <PageHeader title={t('title')} />
      <FavoritesPageContent />
    </DashboardPage>
  );
}
