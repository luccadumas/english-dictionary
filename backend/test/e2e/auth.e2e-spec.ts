import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from '../helpers/create-test-app';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / returns English Dictionary message', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ message: 'English Dictionary' });
  });

  it('POST /auth/signup creates user', async () => {
    const email = `test-${Date.now()}@example.com`;
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email,
        password: 'password123',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('token');
    expect(res.body.name).toBe('Test User');
  });

  it('POST /auth/signin returns token', async () => {
    const email = `signin-${Date.now()}@example.com`;
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ name: 'Sign In User', email, password: 'password123' });

    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'password123' })
      .expect(200);

    expect(res.body.token).toContain('Bearer');
  });

  it('GET /user/me requires auth', () => {
    return request(app.getHttpServer()).get('/user/me').expect(401);
  });

  it('GET /user/me returns profile with valid token', async () => {
    const email = `me-${Date.now()}@example.com`;
    const signup = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ name: 'Me User', email, password: 'password123' });

    const authToken = signup.body.token.replace('Bearer ', '');

    const res = await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.email).toBe(email);
    expect(res.body).not.toHaveProperty('password');
  });
});
