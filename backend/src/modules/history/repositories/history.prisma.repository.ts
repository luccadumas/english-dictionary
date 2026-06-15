import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  IHistoryRepository,
  HistoryListResult,
} from './history.repository.interface';
import {
  encodeTimestampCursor,
  decodeTimestampCursor,
  buildForwardTimestampWhere,
  buildPreviousTimestampWhere,
} from '@/shared/utils/cursor.util';

@Injectable()
export class HistoryPrismaRepository implements IHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addEntry(userId: string, wordId: number): Promise<void> {
    await this.prisma.history.upsert({
      where: { userId_wordId: { userId, wordId } },
      update: { createdAt: new Date() },
      create: { userId, wordId },
    });
  }

  async listHistory(params: {
    userId: string;
    limit: number;
    cursor?: string;
  }): Promise<HistoryListResult> {
    const { userId, limit, cursor } = params;
    const take = limit + 1;

    const decodedCursor = cursor ? decodeTimestampCursor(cursor) : undefined;
    const forwardWhere = buildForwardTimestampWhere(decodedCursor);

    const [entries, totalDocs] = await Promise.all([
      this.prisma.history.findMany({
        where: {
          userId,
          ...(forwardWhere ?? {}),
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take,
        include: { word: { select: { word: true } } },
      }),
      this.prisma.history.count({ where: { userId } }),
    ]);

    const hasNext = entries.length > limit;
    if (hasNext) entries.pop();

    const hasPrev = !!cursor;
    let previous: string | null = null;

    if (hasPrev && entries.length > 0) {
      const first = entries[0];
      const prevAnchor = await this.prisma.history.findFirst({
        where: {
          userId,
          ...buildPreviousTimestampWhere({
            createdAt: first.createdAt,
            id: first.id,
          }),
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        select: { id: true, createdAt: true },
      });

      if (prevAnchor) {
        previous = encodeTimestampCursor({
          createdAt: prevAnchor.createdAt.toISOString(),
          id: prevAnchor.id,
        });
      }
    }

    return {
      results: entries.map((e) => ({
        word: e.word.word,
        added: e.createdAt.toISOString(),
      })),
      totalDocs,
      previous,
      next:
        hasNext && entries.length > 0
          ? encodeTimestampCursor({
              createdAt: entries[entries.length - 1].createdAt.toISOString(),
              id: entries[entries.length - 1].id,
            })
          : null,
      hasNext,
      hasPrev,
    };
  }
}
