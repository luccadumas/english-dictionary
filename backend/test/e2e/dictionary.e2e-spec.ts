import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  createAuthenticatedUser,
  createTestApp,
} from '../helpers/create-test-app';

describe('Dictionary (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    ({ token } = await createAuthenticatedUser(app, 'dict'));

    await prisma.word.createMany({
      data: [
        { word: 'fire' },
        { word: 'firefly' },
        { word: 'fireplace' },
        { word: 'fireman' },
      ],
      skipDuplicates: true,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /entries/en returns cursor paginated words', async () => {
    const res = await request(app.getHttpServer())
      .get('/entries/en?search=fire&limit=2')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.results).toBeDefined();
    expect(res.body).toHaveProperty('totalDocs');
    expect(res.body).toHaveProperty('hasNext');
    expect(res.body).toHaveProperty('hasPrev');
    expect(res.headers).toHaveProperty('x-cache');
    expect(res.headers).toHaveProperty('x-response-time');
    expect(res.headers).toHaveProperty('x-request-id');
  });

  it('GET /entries/en/:word returns word details', async () => {
    const res = await request(app.getHttpServer())
      .get('/entries/en/fire')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
