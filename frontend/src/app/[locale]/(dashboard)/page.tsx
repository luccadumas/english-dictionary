import { asAppLocale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { HomePageContent } from '@/components/home/home-page-content';
import { DashboardPage } from '@/components/layout/dashboard-page';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: asAppLocale(locale), namespace: 'metadata' });

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(asAppLocale(locale));
  const t = await getTranslations('dictionary');

  return (
    <DashboardPage>
      <PageHeader title={t('title')} description={t('homeDescription')} />
      <HomePageContent />
    </DashboardPage>
  );
}
