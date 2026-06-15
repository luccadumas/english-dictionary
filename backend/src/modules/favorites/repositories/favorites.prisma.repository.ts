import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ApiErrorCode } from '@/shared/errors/api-error-codes';
import { apiException } from '@/shared/errors/api.exception';
import {
  IFavoritesRepository,
  FavoritesListResult,
} from './favorites.repository.interface';
import {
  encodeTimestampCursor,
  decodeTimestampCursor,
  buildForwardTimestampWhere,
  buildPreviousTimestampWhere,
} from '@/shared/utils/cursor.util';

@Injectable()
export class FavoritesPrismaRepository implements IFavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addFavorite(userId: string, wordId: number): Promise<void> {
    try {
      await this.prisma.favorite.create({ data: { userId, wordId } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw apiException(
          HttpStatus.CONFLICT,
          ApiErrorCode.FAVORITE_ALREADY_EXISTS,
          'Word is already in favorites',
        );
      }
      throw error;
    }
  }

  async removeFavorite(userId: string, wordId: number): Promise<void> {
    const record = await this.prisma.favorite.findFirst({
      where: { userId, wordId },
    });
    if (!record) {
      throw apiException(
        HttpStatus.NOT_FOUND,
        ApiErrorCode.FAVORITE_NOT_FOUND,
        'Favorite not found',
      );
    }
    await this.prisma.favorite.delete({ where: { id: record.id } });
  }

  async isFavorite(userId: string, wordId: number): Promise<boolean> {
    const record = await this.prisma.favorite.findFirst({
      where: { userId, wordId },
    });
    return !!record;
  }

  async listFavorites(params: {
    userId: string;
    limit: number;
    cursor?: string;
  }): Promise<FavoritesListResult> {
    const { userId, limit, cursor } = params;
    const take = limit + 1;

    const decodedCursor = cursor ? decodeTimestampCursor(cursor) : undefined;
    const forwardWhere = buildForwardTimestampWhere(decodedCursor);

    const [entries, totalDocs] = await Promise.all([
      this.prisma.favorite.findMany({
        where: {
          userId,
          ...(forwardWhere ?? {}),
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take,
        include: { word: { select: { word: true } } },
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    const hasNext = entries.length > limit;
    if (hasNext) entries.pop();

    const hasPrev = !!cursor;
    let previous: string | null = null;

    if (hasPrev && entries.length > 0) {
      const first = entries[0];
      const prevAnchor = await this.prisma.favorite.findFirst({
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
      results: entries.map((e) => ({ word: e.word.word, added: e.createdAt })),
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
