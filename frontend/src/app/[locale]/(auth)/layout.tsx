import { asAppLocale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { AppLogo } from '@/components/shared/app-logo';
import { AuthRedirectOverlay } from '@/components/auth/auth-redirect-overlay';

type AuthLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { locale } = await params;
  setRequestLocale(asAppLocale(locale));
  const tCommon = await getTranslations('common');
  const tDictionary = await getTranslations('dictionary');

  return (
    <>
      <AuthRedirectOverlay />
      <div className="flex min-h-screen">
      <div className="brand-gradient relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <AppLogo variant="inverse" />
        </div>
        <div className="relative z-10 max-w-md space-y-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            {tDictionary('title')}
          </h1>
          <p className="text-base leading-relaxed text-white/85">
            {tDictionary('homeDescription')}
          </p>
        </div>
        <p className="relative z-10 text-sm font-medium text-white/75">
          {tCommon('brandTagline')}
        </p>
      </div>

      <div className="flex flex-1 flex-col bg-muted/30">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="lg:hidden">
            <AppLogo showWordmark={false} />
          </div>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-12 lg:px-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
    </>
  );
}
