import { Module } from '@nestjs/common';
import { WordsPrismaRepository } from './repositories/words.prisma.repository';
import { WORDS_REPOSITORY } from './repositories/words.repository.interface';

@Module({
  providers: [
    {
      provide: WORDS_REPOSITORY,
      useClass: WordsPrismaRepository,
    },
  ],
  exports: [WORDS_REPOSITORY],
})
export class WordsRepositoryModule {}
