import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersPrismaRepository } from './repositories/users.prisma.repository';
import { USERS_REPOSITORY } from './repositories/users.repository.interface';
import { FavoritesModule } from '@/modules/favorites/favorites.module';
import { HistoryModule } from '@/modules/history/history.module';

@Module({
  imports: [FavoritesModule, HistoryModule],
  controllers: [UsersController],
  providers: [
    {
      provide: USERS_REPOSITORY,
      useClass: UsersPrismaRepository,
    },
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}
