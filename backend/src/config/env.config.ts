import { registerAs } from '@nestjs/config';

function parseRedisConfig() {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    try {
      const url = new URL(redisUrl);
      return {
        host: url.hostname,
        port: parseInt(url.port || '6379', 10),
        password: url.password || undefined,
      };
    } catch {
      // fall through to individual env vars
    }
  }

  return {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  };
}

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3333', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret:
    process.env.JWT_SECRET ??
    (process.env.NODE_ENV === 'production' ? undefined : 'dev-only-jwt-secret'),
  expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
}));

export const redisConfig = registerAs('redis', () => parseRedisConfig());

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
}));
