import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/api-error';
import { translateApiError } from '@/lib/i18n/translate-api-error';

const messages: Record<string, string> = {
  generic: 'Generic error',
  'api.EMAIL_ALREADY_IN_USE': 'E-mail já está em uso',
  'api.INVALID_CREDENTIALS': 'E-mail ou senha inválidos',
  'api.WORD_NOT_FOUND': 'Palavra "{word}" não encontrada',
};

const t = (key: string, values?: Record<string, string | number>) => {
  const template = messages[key];
  if (!template) return key;
  if (!values) return template;
  return Object.entries(values).reduce(
    (result, [name, value]) => result.replace(`{${name}}`, String(value)),
    template,
  );
};

describe('translateApiError', () => {
  it('translates by error code from API payload', () => {
    const error = ApiError.fromPayload({
      message: 'Email already in use',
      code: 'EMAIL_ALREADY_IN_USE',
    });

    expect(translateApiError(error, t)).toBe('E-mail já está em uso');
  });

  it('infers code from legacy English message', () => {
    const error = new ApiError('Invalid credentials');

    expect(translateApiError(error, t)).toBe('E-mail ou senha inválidos');
  });

  it('supports params for dynamic messages', () => {
    const error = ApiError.fromPayload({
      message: 'Word "fire" not found',
      code: 'WORD_NOT_FOUND',
      params: { word: 'fire' },
    });

    expect(translateApiError(error, t)).toBe('Palavra "fire" não encontrada');
  });

  it('falls back to generic message', () => {
    expect(translateApiError(new ApiError('Unexpected server failure'), t)).toBe(
      'Generic error',
    );
  });
});
