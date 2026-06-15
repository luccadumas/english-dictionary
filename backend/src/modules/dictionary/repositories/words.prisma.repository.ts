import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { IWordsRepository } from './words.repository.interface';
import { CursorPaginatedWordsDto } from '../dtos/list-words.dto';
import { encodeCursor, decodeCursor } from '@/shared/utils/cursor.util';

@Injectable()
export class WordsPrismaRepository implements IWordsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listWords(params: {
    search?: string;
    limit: number;
    cursor?: string;
  }): Promise<CursorPaginatedWordsDto> {
    const { search, limit, cursor } = params;
    const take = limit + 1;

    let cursorId: number | undefined;
    let previousCursorId: number | undefined;

    if (cursor) {
      cursorId = decodeCursor(cursor);
    }

    const where = {
      ...(search
        ? { word: { startsWith: search, mode: 'insensitive' as const } }
        : {}),
      ...(cursorId ? { id: { gt: cursorId } } : {}),
    };

    const [words, totalDocs] = await Promise.all([
      this.prisma.word.findMany({
        where,
        orderBy: { id: 'asc' },
        take,
        select: { id: true, word: true },
      }),
      this.prisma.word.count({
        where: search
          ? { word: { startsWith: search, mode: 'insensitive' } }
          : {},
      }),
    ]);

    const hasNext = words.length > limit;
    if (hasNext) words.pop();

    const hasPrev = !!cursor;

    if (hasPrev && words.length > 0) {
      const firstId = words[0].id;
      const prev = await this.prisma.word.findFirst({
        where: {
          ...(search
            ? { word: { startsWith: search, mode: 'insensitive' } }
            : {}),
          id: { lt: firstId },
        },
        orderBy: { id: 'desc' },
        select: { id: true },
      });
      previousCursorId = prev?.id;
    }

    return {
      results: words.map((w) => w.word),
      totalDocs,
      previous: previousCursorId ? encodeCursor(previousCursorId) : null,
      next:
        hasNext && words.length > 0
          ? encodeCursor(words[words.length - 1].id)
          : null,
      hasNext,
      hasPrev,
    };
  }

  async findByWord(word: string): Promise<{ id: number; word: string } | null> {
    return this.prisma.word.findUnique({ where: { word } });
  }

  async upsertWord(word: string): Promise<{ id: number; word: string }> {
    return this.prisma.word.upsert({
      where: { word },
      update: {},
      create: { word },
    });
  }
}
