'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/hooks/auth/use-auth';
import { useTranslateApiError } from '@/lib/hooks/use-translate-api-error';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createLoginSchema, type LoginFormValues } from '@/lib/validation/auth-schemas';

export function LoginForm() {
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const { signIn, isSigningIn } = useAuth();
  const translateApiError = useTranslateApiError();

  const loginSchema = useMemo(
    () => createLoginSchema((key) => tValidation(key)),
    [tValidation],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password);
      toast.success(t('welcomeBack'));
    } catch (err) {
      toast.error(translateApiError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <fieldset disabled={isSigningIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t('emailPlaceholder')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t('password')}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="text-xs text-destructive" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSigningIn} aria-busy={isSigningIn}>
          {isSigningIn ? t('signingIn') : t('signIn')}
        </Button>
      </fieldset>
    </form>
  );
}
