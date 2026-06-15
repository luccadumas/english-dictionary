import { Module } from '@nestjs/common';
import {
  DictionaryController,
} from './controllers/dictionary.controller';
import { ListWordsUseCase } from './use-cases/list-words.use-case';
import { GetWordDetailsUseCase } from './use-cases/get-word-details.use-case';
import { DictionaryService } from './services/dictionary.service';
import { FreeDictionaryApiService } from './services/free-dictionary-api.service';
import { WordsRepositoryModule } from './words-repository.module';
import { FavoritesModule } from '@/modules/favorites/favorites.module';
import { HistoryModule } from '@/modules/history/history.module';

@Module({
  imports: [WordsRepositoryModule, FavoritesModule, HistoryModule],
  controllers: [DictionaryController],
  providers: [
    DictionaryService,
    FreeDictionaryApiService,
    ListWordsUseCase,
    GetWordDetailsUseCase,
  ],
  exports: [DictionaryService],
})
export class DictionaryModule {}
