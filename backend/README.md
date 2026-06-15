# Dictionary API

REST API for **English Dictionary** - word lookup, JWT authentication, search history, async favorites, Redis caching, and cursor pagination.

**Production:** https://dictionary-api-production-d35d.up.railway.app  
**Swagger:** https://dictionary-api-production-d35d.up.railway.app/docs

## Stack

- NestJS 10 · TypeScript · Node.js 22+
- PostgreSQL · Prisma ORM
- Redis · BullMQ (favorites queue)
- JWT · Passport · Swagger · Jest

## Prerequisites

- Node.js **22+**
- Docker (Postgres + Redis) - start from monorepo root: `npm run dev:infra`
- **npm** or **Yarn**

## Setup

```bash
# From monorepo root
npm run dev:infra

cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run import:words   # optional - ~370k words
```

### Environment variables

| Variable | Description | Local default |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://postgres:postgres@localhost:5432/dictionary` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | _(empty in dev)_ |
| `REDIS_URL` | Full Redis URL (Railway) | _(optional locally)_ |
| `JWT_SECRET` | JWT secret | _(required)_ |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `PORT` | API port | `3333` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed origin(s) - comma-separated | `http://localhost:3000` |

## Run

```bash
npm run start:dev
```

Local API: http://localhost:3333  
Swagger: http://localhost:3333/docs

From monorepo root: `npm run dev:backend`

## Scripts

| Script | Description |
|--------|-------------|
| `start:dev` | NestJS in watch mode |
| `start:prod` | Run production build |
| `build` | Compile TypeScript |
| `test` | Unit tests (Jest) |
| `test:e2e` | E2E integration tests |
| `lint` | ESLint |
| `prisma:migrate` | Dev migrations |
| `prisma:deploy` | Production migrations |
| `import:words` | Import words into the database |

## Main endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/auth/signup` | Sign up |
| `POST` | `/auth/signin` | Sign in (JWT) |
| `GET` | `/entries/en` | List words (cursor pagination) |
| `GET` | `/entries/en/:word` | Word details |
| `POST` | `/entries/en/:word/favorite` | Add favorite (202 - async via BullMQ) |
| `DELETE` | `/entries/en/:word/unfavorite` | Remove favorite |
| `GET` | `/entries/en/:word/is-favorite` | Check favorite status |
| `GET` | `/user/me/history` | User search history |
| `GET` | `/user/me/favorites` | User favorites |

Observability headers: `x-request-id`, `x-cache`, `x-response-time`.

## Deploy (Railway)

The API runs on **Railway** using the root `Dockerfile` (monorepo build context).

### Files

| File | Purpose |
|------|---------|
| `/Dockerfile` | Production image (copies `backend/`) |
| `/railway.toml` | Build and deploy config |
| `backend/Dockerfile` | Same image, used by `docker-compose` |

### Variables (production)

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=<strong-secret>
JWT_EXPIRES_IN=7d
PORT=3333
NODE_ENV=production
CORS_ORIGIN=https://english-dictionary-web.vercel.app
```

See `backend/.env.production.example` for a template.

### One-time word import (production)

```bash
./scripts/import-words.sh
# or: npm run import:words:remote
```

Uses `railway run` with production `DATABASE_URL` (~370k words, several minutes).

Or run `.\scripts\railway-setup.ps1` from the monorepo root.

## Docker (local)

```bash
# API only (with infra)
docker compose --profile prod up --build api-prod postgres redis

# Build image manually
docker build -t dictionary-api ./backend --target runner
```

Entrypoint runs `prisma migrate deploy` then starts the app (`docker-entrypoint.sh`).

## Structure

```
backend/
├── Dockerfile
├── docker-entrypoint.sh
├── src/
│   ├── modules/          # auth, users, dictionary, favorites, history
│   ├── infra/            # prisma, redis, queue
│   └── shared/
├── prisma/
├── scripts/
└── test/
```

## Tests

```bash
npm test
npm run test:e2e
```

From monorepo root: `npm run test:all`

## Monorepo documentation

- [Root README](../README.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [GitHub setup](../docs/GITHUB.md)
