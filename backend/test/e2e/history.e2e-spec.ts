import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createAuthenticatedUser,
  createTestApp,
} from '../helpers/create-test-app';

describe('History (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    ({ app } = await createTestApp());
    ({ token } = await createAuthenticatedUser(app, 'hist'));
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /entries/en/:word registers history', async () => {
    await request(app.getHttpServer())
      .get('/entries/en/hello')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/user/me/history')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0]).toHaveProperty('word');
    expect(res.body.results[0]).toHaveProperty('added');
    expect(res.body).toHaveProperty('hasNext');
    expect(res.body).toHaveProperty('hasPrev');
  });

  it('does not duplicate history when viewing the same word twice', async () => {
    await request(app.getHttpServer())
      .get('/entries/en/world')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/entries/en/world')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/user/me/history')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const worldEntries = res.body.results.filter(
      (entry: { word: string }) => entry.word === 'world',
    );
    expect(worldEntries).toHaveLength(1);
  });
});
