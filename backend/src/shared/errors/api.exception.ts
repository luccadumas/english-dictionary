import { HttpException, HttpStatus } from '@nestjs/common';
import type { ApiErrorCode } from './api-error-codes';

type ApiErrorBody = {
  message: string;
  code: ApiErrorCode;
  params?: Record<string, string | number>;
};

export function apiException(
  status: HttpStatus,
  code: ApiErrorCode,
  message: string,
  params?: Record<string, string | number>,
): HttpException {
  const body: ApiErrorBody = { message, code };
  if (params) body.params = params;
  return new HttpException(body, status);
}
