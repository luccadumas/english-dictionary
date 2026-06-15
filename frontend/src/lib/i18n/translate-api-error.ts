import {
  ApiError,
  inferCodeFromMessage,
  inferParamsFromMessage,
  normalizeToApiError,
} from '@/lib/api/api-error';

export type ErrorTranslator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

function resolveTranslationKey(code: string): string {
  return `api.${code}`;
}

function tryTranslate(
  key: string,
  t: ErrorTranslator,
  params?: Record<string, string | number>,
): string | null {
  try {
    const translated = t(key, params);
    if (!translated || translated === key || translated.endsWith(key)) {
      return null;
    }
    return translated;
  } catch {
    return null;
  }
}

export function translateApiError(error: unknown, t: ErrorTranslator): string {
  const apiError = normalizeToApiError(error);
  const code = apiError.code ?? inferCodeFromMessage(apiError.message);
  const params =
    apiError.params ??
    (code ? inferParamsFromMessage(apiError.message, code) : undefined);

  if (code) {
    const translated = tryTranslate(resolveTranslationKey(code), t, params);
    if (translated) return translated;
  }

  return t('generic');
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
