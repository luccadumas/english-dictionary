import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export interface TestAppContext {
  app: INestApplication;
  prisma: PrismaService;
}

export async function createTestApp(): Promise<TestAppContext> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();

  return {
    app,
    prisma: app.get(PrismaService),
  };
}

export async function createAuthenticatedUser(
  app: INestApplication,
  prefix = 'user',
): Promise<{ token: string; email: string }> {
  const email = `${prefix}-${Date.now()}@example.com`;
  const signup = await request(app.getHttpServer())
    .post('/auth/signup')
    .send({ name: 'Test User', email, password: 'password123' });

  return {
    email,
    token: signup.body.token.replace('Bearer ', ''),
  };
}
