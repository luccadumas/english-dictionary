import { asAppLocale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { WordPageContent } from '@/components/dictionary/word-page-content';
import { DashboardPage } from '@/components/layout/dashboard-page';

type WordPageProps = {
  params: Promise<{ locale: string; word: string }>;
};

export async function generateMetadata({
  params,
}: WordPageProps): Promise<Metadata> {
  const { locale, word } = await params;
  const decoded = decodeURIComponent(word);
  const t = await getTranslations({ locale: asAppLocale(locale), namespace: 'metadata' });

  return {
    title: t('wordTitle', { word: decoded }),
    description: t('wordDescription', { word: decoded }),
  };
}

export default async function WordPage({ params }: WordPageProps) {
  const { locale, word } = await params;
  setRequestLocale(asAppLocale(locale));

  return (
    <DashboardPage>
      <WordPageContent word={decodeURIComponent(word)} />
    </DashboardPage>
  );
}
