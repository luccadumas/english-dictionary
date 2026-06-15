import { BadRequestException, Injectable } from '@nestjs/common';

export function encodeCursor(id: number): string {
  return Buffer.from(JSON.stringify({ id })).toString('base64');
}

export function decodeCursor(cursor: string): number {
  try {
    const decoded = JSON.parse(
      Buffer.from(cursor, 'base64').toString('utf-8'),
    ) as { id: number };
    if (typeof decoded.id !== 'number' || Number.isNaN(decoded.id)) {
      throw new BadRequestException('Invalid cursor');
    }
    return decoded.id;
  } catch (error) {
    if (error instanceof BadRequestException) throw error;
    throw new BadRequestException('Invalid cursor');
  }
}

export interface TimestampCursor {
  createdAt: string;
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
      throw new BadRequestException('Invalid cursor');
    }
    return decoded;
  } catch (error) {
    if (error instanceof BadRequestException) throw error;
    throw new BadRequestException('Invalid cursor');
  }
}

export function buildForwardTimestampWhere(
  cursor: TimestampCursor | undefined,
): Record<string, unknown> | undefined {
  if (!cursor) return undefined;

  const date = new Date(cursor.createdAt);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException('Invalid cursor');
  }

  return {
    OR: [
      { createdAt: { lt: date } },
      { createdAt: date, id: { lt: cursor.id } },
    ],
  };
}

export function buildPreviousTimestampWhere(first: {
  createdAt: Date;
  id: string;
}): Record<string, unknown> {
  return {
    OR: [
      { createdAt: { gt: first.createdAt } },
      { createdAt: first.createdAt, id: { gt: first.id } },
    ],
  };
}
