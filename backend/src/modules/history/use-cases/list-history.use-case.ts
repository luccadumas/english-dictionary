import { Injectable, Inject } from '@nestjs/common';
import {
  IHistoryRepository,
  HISTORY_REPOSITORY,
  HistoryListResult,
} from '../repositories/history.repository.interface';

@Injectable()
export class ListHistoryUseCase {
  constructor(
    @Inject(HISTORY_REPOSITORY)
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async execute(params: {
    userId: string;
    limit: number;
    cursor?: string;
  }): Promise<HistoryListResult> {
    return this.historyRepository.listHistory(params);
  }
}
