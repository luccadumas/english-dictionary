import { z } from 'zod';

type ValidationTranslator = (
  key:
    | 'emailInvalid'
    | 'passwordRequired'
    | 'passwordMin'
    | 'nameMin'
    | 'passwordsMismatch',
  values?: Record<string, string | number>,
) => string;

export function createLoginSchema(t: ValidationTranslator) {
  return z.object({
    email: z.string().email({ message: t('emailInvalid') }),
    password: z.string().min(1, { message: t('passwordRequired') }),
  });
}

export function createRegisterSchema(t: ValidationTranslator) {
  return z
    .object({
      name: z.string().min(2, { message: t('nameMin', { min: 2 }) }),
      email: z.string().email({ message: t('emailInvalid') }),
      password: z.string().min(6, { message: t('passwordMin', { min: 6 }) }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordsMismatch'),
      path: ['confirmPassword'],
    });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;
