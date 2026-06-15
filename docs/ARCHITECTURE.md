# Architecture and project structure

Conventions and layout of the English Dictionary monorepo.

## Overview

```
dictionary/
├── backend/                 # NestJS API
├── frontend/                # Next.js 15 app
├── docs/
│   ├── ARCHITECTURE.md
│   └── GITHUB.md
├── Dockerfile               # API image (Railway - monorepo root context)
├── railway.toml             # Railway config for dictionary-api
├── docker-compose.yml       # Local dev + prod simulation
├── .github/workflows/       # CI/CD
└── package.json             # Monorepo scripts (npm / Yarn)
```

Each package (`backend`, `frontend`) has its own `package.json`, dependencies, and build cycle.

---

## Production architecture

```
                    ┌─────────────────────┐
                    │      GitHub         │
                    │  english-dictionary │
                    └─────────┬───────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │     Railway      │             │     Vercel       │
    │  dictionary-api  │             │    frontend/     │
    │  Postgres + Redis│             │   Next.js 15     │
    └─────────────────┘             └─────────────────┘
              │                               │
              └─────────── REST API ──────────┘
                    (NEXT_PUBLIC_API_URL)
```

| Component | Platform | Node | Image / build |
|-----------|----------|------|---------------|
| API | Railway | 22 | Root `Dockerfile` + `railway.toml` |
| Frontend | Vercel | 22 | `frontend/vercel.json` - no Docker in prod |
| Postgres | Railway plugin | - | Managed |
| Redis | Railway plugin | - | Managed |

**CORS:** API `CORS_ORIGIN` must include the Vercel frontend URL.

---

## Backend (NestJS)

### `src/` layout

```
src/
├── main.ts
├── app.module.ts
├── config/                  # env validation and config
├── infra/
│   ├── cache/redis/
│   ├── database/prisma/
│   └── queue/               # BullMQ
├── modules/
│   ├── auth/
│   ├── users/
│   ├── dictionary/
│   ├── favorites/
│   └── history/
└── shared/                  # DTOs, filters, utils
```

### Domain modules

Each module under `modules/` follows:

```
modules/<domain>/
├── <domain>.module.ts
├── controllers/
├── use-cases/
├── services/
├── repositories/
└── dtos/
```

### Key behaviors

- **Dictionary:** proxies Free Dictionary API; Redis cache with `x-cache` and `x-response-time` headers
- **Favorites:** async persistence via BullMQ (202 Accepted)
- **Pagination:** cursor-based (`previous` / `next` / `hasPrev` / `hasNext` / `totalDocs`)
- **Auth:** JWT (Bearer token)
- **Redis:** supports `REDIS_URL` (Railway) or `REDIS_HOST`/`REDIS_PORT` (local)

### Docker

| Context | Dockerfile | Usage |
|---------|------------|-------|
| Monorepo root | `/Dockerfile` | Railway production deploy |
| `backend/` | `backend/Dockerfile` | `docker-compose`, local builds |

Entrypoint: `docker-entrypoint.sh` - runs `prisma migrate deploy`, then `node dist/main.js`.

### Tests

| Type | Location | Tool |
|------|----------|------|
| Unit | `src/**/*.spec.ts` | Jest |
| E2E | `test/e2e/*.e2e-spec.ts` | Jest + Supertest |

---

## Frontend (Next.js 15)

### `src/` layout

```
src/
├── app/[locale]/            # App Router + i18n (en, pt-BR, es)
├── components/              # Feature UI + Shadcn
├── lib/
│   ├── api/                 # Axios client
│   ├── hooks/               # TanStack Query hooks
│   └── query/               # Prefetch, cursor pagination
├── messages/                # i18n JSON
└── types/
```

### Data fetching

- TanStack Query for server state
- Prefetch on nav link hover/click
- Infinite scroll with cursor pagination
- API URL from `NEXT_PUBLIC_API_URL`

### Deploy

- **Production:** Vercel (`frontend/vercel.json`, region `gru1`)
- **Local Docker:** `frontend/Dockerfile` with `output: 'standalone'` - simulation only

### Tests

| Type | Location | Tool |
|------|----------|------|
| Unit | `src/**/__tests__/*.test.ts` | Vitest |

---

## Docker Compose (local)

| Profile | Services | Purpose |
|---------|----------|---------|
| `dev` | postgres, redis, api-dev, web-dev | Hot-reload development |
| `prod` | postgres, redis, api-prod, web-prod | Production image simulation |

```bash
npm run dev:infra                              # postgres + redis only
docker compose --profile dev up --build        # full dev stack
docker compose --profile prod up --build       # prod images locally
```

---

## CI

Workflow `.github/workflows/ci.yml`:

| Job | Steps |
|-----|-------|
| `backend` | lint → migrate → unit → E2E → build (Node 22) |
| `frontend` | lint → unit → build (Node 22) |
| `docker` | Build `backend/Dockerfile` + `frontend/Dockerfile` on `main` |

Optional deploy jobs use `RAILWAY_TOKEN` and `VERCEL_TOKEN` secrets.

---

## Useful commands

```bash
# Monorepo root
npm run test:all
yarn test:all
npm run build
yarn build
npm run import:words

# Backend
cd backend && npm test && npm run test:e2e

# Frontend
cd frontend && npm test && npm run build
cd frontend && yarn test && yarn build

# Railway (API)
railway service link dictionary-api
railway redeploy --from-source -y

# Vercel (frontend)
cd frontend && vercel --prod
```

---

## Related docs

- [Root README](../README.md)
- [Backend README](../backend/README.md)
- [Frontend README](../frontend/README.md)
- [GitHub setup](./GITHUB.md)
