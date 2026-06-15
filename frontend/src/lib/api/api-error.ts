export type ApiErrorPayload = {
  message?: string | string[];
  code?: string;
  params?: Record<string, string | number>;
};

export class ApiError extends Error {
  readonly code?: string;

  readonly params?: Record<string, string | number>;

  constructor(
    message: string,
    code?: string,
    params?: Record<string, string | number>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.params = params;
  }

  static fromPayload(
    payload: unknown,
    fallbackMessage = 'Unknown error',
  ): ApiError {
    if (typeof payload !== 'object' || payload === null) {
      return new ApiError(fallbackMessage);
    }

    const body = payload as ApiErrorPayload;
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : typeof body.message === 'string'
        ? body.message
        : fallbackMessage;

    const code = typeof body.code === 'string' ? body.code : undefined;
    const params =
      body.params && typeof body.params === 'object' ? body.params : undefined;

    return new ApiError(message, code ?? inferCodeFromMessage(message), params);
  }
}

const EXACT_MESSAGE_TO_CODE: Record<string, string> = {
  'Email already in use': 'EMAIL_ALREADY_IN_USE',
  'Invalid credentials': 'INVALID_CREDENTIALS',
  'Word is already in favorites': 'FAVORITE_ALREADY_EXISTS',
  'Favorite not found': 'FAVORITE_NOT_FOUND',
  'User not found': 'USER_NOT_FOUND',
  'Invalid cursor': 'INVALID_CURSOR',
  'Authentication required': 'AUTHENTICATION_REQUIRED',
  'Authentication failed': 'AUTHENTICATION_FAILED',
  'Dictionary service temporarily unavailable': 'DICTIONARY_SERVICE_UNAVAILABLE',
  'Audio service temporarily unavailable': 'AUDIO_SERVICE_UNAVAILABLE',
  'Unknown error': 'UNKNOWN',
};

const MESSAGE_PATTERNS: Array<{
  regex: RegExp;
  code: string;
  paramKey: string;
}> = [
  { regex: /^Word "(.+)" not found$/, code: 'WORD_NOT_FOUND', paramKey: 'word' },
  {
    regex: /^Audio not found for word "(.+)"$/,
    code: 'AUDIO_NOT_FOUND',
    paramKey: 'word',
  },
];

export function inferCodeFromMessage(message: string): string | undefined {
  const exact = EXACT_MESSAGE_TO_CODE[message];
  if (exact) return exact;

  for (const pattern of MESSAGE_PATTERNS) {
    const match = message.match(pattern.regex);
    if (match) return pattern.code;
  }

  return undefined;
}

export function inferParamsFromMessage(
  message: string,
  code: string,
): Record<string, string | number> | undefined {
  for (const pattern of MESSAGE_PATTERNS) {
    if (pattern.code !== code) continue;
    const match = message.match(pattern.regex);
    if (match?.[1]) return { [pattern.paramKey]: match[1] };
  }
  return undefined;
}

export function normalizeToApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof Error) {
    const code = inferCodeFromMessage(error.message);
    const params = code ? inferParamsFromMessage(error.message, code) : undefined;
    return new ApiError(error.message, code, params);
  }

  return new ApiError('Unknown error', 'UNKNOWN');
}
