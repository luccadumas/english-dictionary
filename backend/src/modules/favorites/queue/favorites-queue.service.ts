import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  ADD_FAVORITE_JOB,
  AddFavoriteJobPayload,
  FAVORITES_QUEUE,
} from './favorites.queue.constants';
import { AddFavoriteUseCase } from '../use-cases/add-favorite.use-case';

@Injectable()
export class FavoritesQueueService {
  private readonly logger = new Logger(FavoritesQueueService.name);

  constructor(
    @InjectQueue(FAVORITES_QUEUE)
    private readonly favoritesQueue: Queue<AddFavoriteJobPayload>,
    private readonly addFavoriteUseCase: AddFavoriteUseCase,
  ) {}

  async enqueueAddFavorite(userId: string, word: string): Promise<void> {
    try {
      await this.favoritesQueue.add(
        ADD_FAVORITE_JOB,
        { userId, word },
        {
          jobId: `${userId}:${word.toLowerCase()}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
    } catch (error) {
      this.logger.warn(
        'Queue unavailable, falling back to synchronous favorite',
        error,
      );
      await this.addFavoriteUseCase.execute(userId, word);
    }
  }
}
