import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FavoritesPrismaRepository } from './repositories/favorites.prisma.repository';
import { FAVORITES_REPOSITORY } from './repositories/favorites.repository.interface';
import { AddFavoriteUseCase } from './use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from './use-cases/remove-favorite.use-case';
import { ListFavoritesUseCase } from './use-cases/list-favorites.use-case';
import { IsFavoriteUseCase } from './use-cases/is-favorite.use-case';
import { WordsRepositoryModule } from '@/modules/dictionary/words-repository.module';
import { FAVORITES_QUEUE } from './queue/favorites.queue.constants';
import { AddFavoriteProcessor } from './queue/add-favorite.processor';
import { FavoritesQueueService } from './queue/favorites-queue.service';

@Module({
  imports: [WordsRepositoryModule, BullModule.registerQueue({ name: FAVORITES_QUEUE })],
  providers: [
    {
      provide: FAVORITES_REPOSITORY,
      useClass: FavoritesPrismaRepository,
    },
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    ListFavoritesUseCase,
    IsFavoriteUseCase,
    AddFavoriteProcessor,
    FavoritesQueueService,
  ],
  exports: [
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    ListFavoritesUseCase,
    IsFavoriteUseCase,
    FavoritesQueueService,
  ],
})
export class FavoritesModule {}
