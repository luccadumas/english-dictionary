import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function waitForFavoriteStatus(
  app: INestApplication,
  token: string,
  word: string,
  expected: boolean,
  maxAttempts = 15,
): Promise<void> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await request(app.getHttpServer())
      .get(`/entries/en/${word}/is-favorite`)
      .set('Authorization', `Bearer ${token}`);

    if (res.body.isFavorite === expected) return;

    await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
  }

  throw new Error(
    `Favorite status for "${word}" did not become ${expected} in time`,
  );
}
