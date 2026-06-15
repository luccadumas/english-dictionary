import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiErrorCode } from '@/shared/errors/api-error-codes';
import { apiException } from '@/shared/errors/api.exception';

function invalidCursorError() {
  return apiException(
    HttpStatus.BAD_REQUEST,
    ApiErrorCode.INVALID_CURSOR,
    'Invalid cursor',
  );
}

export function encodeCursor(id: number): string {
  return Buffer.from(JSON.stringify({ id })).toString('base64');
}

export function decodeCursor(cursor: string): number {
  try {
    const decoded = JSON.parse(
      Buffer.from(cursor, 'base64').toString('utf-8'),
    ) as { id: number };
    if (typeof decoded.id !== 'number' || Number.isNaN(decoded.id)) {
      throw invalidCursorError();
    }
    return decoded.id;
  } catch (error) {
    if (error instanceof HttpException) throw error;
    throw invalidCursorError();
  }
}

export interface TimestampCursor {
  createdAt: string | Date;
  id: string;
}

export function encodeTimestampCursor(data: TimestampCursor): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function decodeTimestampCursor(cursor: string): TimestampCursor {
  try {
    const decoded = JSON.parse(
      Buffer.from(cursor, 'base64').toString('utf-8'),
    ) as TimestampCursor;
    if (!decoded.createdAt || !decoded.id) {
      throw invalidCursorError();
    }
    return decoded;
  } catch (error) {
    if (error instanceof HttpException) throw error;
    throw invalidCursorError();
  }
}

function toValidDate(value: string | Date): Date {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw invalidCursorError();
  }
  return date;
}

export function buildForwardTimestampWhere(
  cursor: TimestampCursor | undefined,
): Record<string, unknown> | undefined {
  if (!cursor) return undefined;

  const date = toValidDate(cursor.createdAt);

  return {
    OR: [
      { createdAt: { lt: date } },
      { createdAt: date, id: { lt: cursor.id } },
    ],
  };
}

export function buildPreviousTimestampWhere(cursor: TimestampCursor): {
  OR: Array<Record<string, unknown>>;
} {
  const date = toValidDate(cursor.createdAt);

  return {
    OR: [
      { createdAt: { gt: date } },
      { createdAt: date, id: { gt: cursor.id } },
    ],
  };
}
