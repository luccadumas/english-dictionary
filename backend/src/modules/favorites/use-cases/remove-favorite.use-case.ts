import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IFavoritesRepository,
  FAVORITES_REPOSITORY,
} from '../repositories/favorites.repository.interface';
import {
  IWordsRepository,
  WORDS_REPOSITORY,
} from '@/modules/dictionary/repositories/words.repository.interface';

@Injectable()
export class RemoveFavoriteUseCase {
  constructor(
    @Inject(FAVORITES_REPOSITORY)
    private readonly favoritesRepository: IFavoritesRepository,
    @Inject(WORDS_REPOSITORY)
    private readonly wordsRepository: IWordsRepository,
  ) {}

  async execute(userId: string, word: string): Promise<void> {
    const wordRecord = await this.wordsRepository.findByWord(word);
    if (!wordRecord) {
      throw new NotFoundException('Favorite not found');
    }
    await this.favoritesRepository.removeFavorite(userId, wordRecord.id);
  }
}
