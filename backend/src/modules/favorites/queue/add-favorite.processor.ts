import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  ADD_FAVORITE_JOB,
  AddFavoriteJobPayload,
  FAVORITES_QUEUE,
} from './favorites.queue.constants';
import { AddFavoriteUseCase } from '../use-cases/add-favorite.use-case';

@Processor(FAVORITES_QUEUE)
export class AddFavoriteProcessor extends WorkerHost {
  private readonly logger = new Logger(AddFavoriteProcessor.name);

  constructor(private readonly addFavoriteUseCase: AddFavoriteUseCase) {
    super();
  }

  async process(job: Job<AddFavoriteJobPayload>): Promise<void> {
    if (job.name !== ADD_FAVORITE_JOB) return;

    const { userId, word } = job.data;
    this.logger.log(`Processing favorite job for "${word}" (user: ${userId})`);
    await this.addFavoriteUseCase.execute(userId, word);
  }
}
