# Dictionary API

REST API for **English Dictionary** — word lookup, JWT authentication, search history, async favorites, Redis caching, and cursor pagination.

Interactive docs: `{API_URL}/docs` (Swagger/OpenAPI 3.0).

## Stack

- NestJS 10 · TypeScript · Node.js 22+
- PostgreSQL · Prisma ORM
- Redis · BullMQ (favorites queue)
- JWT · Passport · Swagger · Jest

## Prerequisites

- Node.js **22+**
- Docker (Postgres + Redis) — start from monorepo root: `npm run dev:infra` or `yarn dev:infra`
- **npm** or **Yarn**

## Setup

```bash
# From monorepo root
npm run dev:infra
# or: yarn dev:infra

cd backend
cp .env.example .env
```

### Environment variables

| Variable | Description | Local default |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://postgres:postgres@localhost:5432/dictionary` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | _(empty in dev)_ |
| `JWT_SECRET` | JWT secret | _(required)_ |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `PORT` | API port | `3333` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed origin (frontend) | `http://localhost:3000` |

### Database and seed

```bash
# npm
npm install
npx prisma migrate dev
npm run import:words   # optional — ~370k words

# Yarn
yarn install
yarn prisma:migrate
yarn import:words
```

## Run

```bash
# Development (watch)
npm run start:dev
# or: yarn start:dev

# Production
npm run build && npm run start:prod
```

Local API: http://localhost:3333  
Swagger: http://localhost:3333/docs

You can also start from the monorepo root: `npm run dev:backend` or `yarn dev:backend`.

## Scripts

| Script | Description |
|--------|-------------|
| `start:dev` | NestJS in watch mode |
| `start:prod` | Run production build |
| `build` | Compile TypeScript |
| `test` | Unit tests (Jest) |
| `test:e2e` | E2E integration tests |
| `test:cov` | Test coverage |
| `lint` | ESLint |
| `prisma:migrate` | Dev migrations |
| `prisma:deploy` | Production migrations |
| `prisma:studio` | Prisma Studio |
| `import:words` | Import words into the database |

## Main endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/auth/signup` | Sign up |
| `POST` | `/auth/signin` | Sign in (JWT) |
| `GET` | `/entries/en` | List words (cursor pagination) |
| `GET` | `/entries/en/:word` | Word details |
| `POST` | `/entries/en/:word/favorite` | Add favorite (202 — async via BullMQ) |
| `DELETE` | `/entries/en/:word/unfavorite` | Remove favorite |
| `GET` | `/entries/en/:word/is-favorite` | Check favorite status |
| `GET` | `/user/me/history` | User search history |
| `GET` | `/user/me/favorites` | User favorites |

Paginated responses include: `results`, `totalDocs`, `previous`, `next`, `hasPrev`, `hasNext`.

Observability headers: `x-request-id`, `x-cache`, `x-response-time`.

## Structure

```
backend/
├── src/
│   ├── modules/          # auth, users, dictionary, favorites, history
│   ├── infra/            # prisma, redis, queue
│   └── shared/           # DTOs, filters, utils
├── prisma/
├── scripts/              # import:words
└── test/
    ├── e2e/
    └── helpers/
```

## Tests

```bash
npm test
npm run test:e2e

# or
yarn test
yarn test:e2e
```

From monorepo root: `npm run test` / `yarn test`.

## Monorepo documentation

- [Root README](../README.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [GitHub setup](../docs/GITHUB.md)
