import { Module } from '@nestjs/common';
import { HistoryPrismaRepository } from './repositories/history.prisma.repository';
import { HISTORY_REPOSITORY } from './repositories/history.repository.interface';
import { AddHistoryUseCase } from './use-cases/add-history.use-case';
import { ListHistoryUseCase } from './use-cases/list-history.use-case';
import { WordsRepositoryModule } from '@/modules/dictionary/words-repository.module';

@Module({
  imports: [WordsRepositoryModule],
  providers: [
    {
      provide: HISTORY_REPOSITORY,
      useClass: HistoryPrismaRepository,
    },
    AddHistoryUseCase,
    ListHistoryUseCase,
  ],
  exports: [AddHistoryUseCase, ListHistoryUseCase],
})
export class HistoryModule {}
