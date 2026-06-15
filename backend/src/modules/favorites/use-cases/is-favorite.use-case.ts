import { Injectable, Inject } from '@nestjs/common';
import {
  IFavoritesRepository,
  FAVORITES_REPOSITORY,
} from '../repositories/favorites.repository.interface';
import {
  IWordsRepository,
  WORDS_REPOSITORY,
} from '@/modules/dictionary/repositories/words.repository.interface';

@Injectable()
export class IsFavoriteUseCase {
  constructor(
    @Inject(FAVORITES_REPOSITORY)
    private readonly favoritesRepository: IFavoritesRepository,
    @Inject(WORDS_REPOSITORY)
    private readonly wordsRepository: IWordsRepository,
  ) {}

  async execute(userId: string, word: string): Promise<boolean> {
    const wordRecord = await this.wordsRepository.findByWord(word);
    if (!wordRecord) return false;
    return this.favoritesRepository.isFavorite(userId, wordRecord.id);
  }
}
