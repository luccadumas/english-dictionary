import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createAuthenticatedUser,
  createTestApp,
} from '../helpers/create-test-app';
import { waitForFavoriteStatus } from '../helpers/wait-for-favorite';

describe('Favorites (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    ({ app } = await createTestApp());
    ({ token } = await createAuthenticatedUser(app, 'fav'));
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /entries/en/:word/favorite returns 202 Accepted', async () => {
    const res = await request(app.getHttpServer())
      .post('/entries/en/fire/favorite')
      .set('Authorization', `Bearer ${token}`)
      .expect(202);

    expect(res.body.message).toContain('favorites');
  });

  it('GET /user/me/favorites lists favorites', async () => {
    await waitForFavoriteStatus(app, token, 'fire', true);

    const res = await request(app.getHttpServer())
      .get('/user/me/favorites')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.results).toBeDefined();
    expect(res.body).toHaveProperty('totalDocs');
  });

  it('DELETE /entries/en/:word/unfavorite returns 204', async () => {
    await request(app.getHttpServer())
      .post('/entries/en/water/favorite')
      .set('Authorization', `Bearer ${token}`)
      .expect(202);

    await waitForFavoriteStatus(app, token, 'water', true);

    return request(app.getHttpServer())
      .delete('/entries/en/water/unfavorite')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});
