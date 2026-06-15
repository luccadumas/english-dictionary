import { Injectable, Inject } from '@nestjs/common';
import {
  IHistoryRepository,
  HISTORY_REPOSITORY,
} from '../repositories/history.repository.interface';
import {
  WORDS_REPOSITORY,
  IWordsRepository,
} from '@/modules/dictionary/repositories/words.repository.interface';

@Injectable()
export class AddHistoryUseCase {
  constructor(
    @Inject(HISTORY_REPOSITORY)
    private readonly historyRepository: IHistoryRepository,
    @Inject(WORDS_REPOSITORY)
    private readonly wordsRepository: IWordsRepository,
  ) {}

  async execute(userId: string, word: string): Promise<void> {
    const wordRecord = await this.wordsRepository.upsertWord(word);
    await this.historyRepository.addEntry(userId, wordRecord.id);
  }
}
