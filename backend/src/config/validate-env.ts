const INSECURE_JWT_SECRETS = new Set([
  '',
  'fallback-secret',
  'your-super-secret-jwt-key-change-in-production',
]);

export function validateEnv(): void {
  const errors: string[] = [];

  if (!process.env.DATABASE_URL) {
    errors.push('DATABASE_URL is required');
  }

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    if (!process.env.JWT_SECRET || INSECURE_JWT_SECRETS.has(process.env.JWT_SECRET)) {
      errors.push('JWT_SECRET must be set to a strong value in production');
    }
    if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*') {
      errors.push('CORS_ORIGIN must be set to an explicit origin in production');
    } else if (process.env.CORS_ORIGIN.split(',').some((origin) => origin.trim() === '*')) {
      errors.push('CORS_ORIGIN must not include wildcard origins in production');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n- ${errors.join('\n- ')}`);
  }
}
