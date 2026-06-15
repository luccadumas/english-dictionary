import { HttpStatus, Injectable, Inject } from '@nestjs/common';
import {
  IFavoritesRepository,
  FAVORITES_REPOSITORY,
} from '../repositories/favorites.repository.interface';
import {
  IWordsRepository,
  WORDS_REPOSITORY,
} from '@/modules/dictionary/repositories/words.repository.interface';
import { ApiErrorCode } from '@/shared/errors/api-error-codes';
import { apiException } from '@/shared/errors/api.exception';

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
      throw apiException(
        HttpStatus.NOT_FOUND,
        ApiErrorCode.FAVORITE_NOT_FOUND,
        'Favorite not found',
      );
    }
    await this.favoritesRepository.removeFavorite(userId, wordRecord.id);
  }
}
