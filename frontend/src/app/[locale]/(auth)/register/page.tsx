import { asAppLocale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RegisterForm } from '@/components/auth/register-form';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: asAppLocale(locale), namespace: 'metadata' });

  return {
    title: t('registerTitle'),
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(asAppLocale(locale));
  const t = await getTranslations('auth');

  return (
    <Card className="border-0 shadow-elevated ring-1 ring-brand/10">
      <CardHeader>
        <CardTitle>{t('signupTitle')}</CardTitle>
        <CardDescription>{t('signupDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('hasAccount')}{' '}
          <Link
            href="/login"
            className="rounded-sm font-medium text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t('signIn')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
