import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  appConfig,
  jwtConfig,
  redisConfig,
  databaseConfig,
} from './config/env.config';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { RedisModule } from './infra/cache/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';
import { CacheResponseInterceptor } from './shared/interceptors/cache-response.interceptor';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { RequestIdMiddleware } from './shared/middleware/request-id.middleware';
import { BullQueueModule } from './infra/queue/bull.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, redisConfig, databaseConfig],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    BullQueueModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    DictionaryModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: CacheResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
