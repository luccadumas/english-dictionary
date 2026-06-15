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
├── .github/workflows/       # CI/CD
├── docker-compose.yml
└── package.json             # Monorepo scripts (npm / Yarn)
```

Each package (`backend`, `frontend`) has its own `package.json`, dependencies, and build cycle.

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

### Tests

| Type | Location | Tool |
|------|----------|------|
| Unit | `src/**/__tests__/*.test.ts` | Vitest |

---

## Useful commands

```bash
# Monorepo root
npm run test:all
npm run build
npm run import:words

# Backend
cd backend && npm test && npm run test:e2e

# Frontend
cd frontend && npm test && npm run build
```

Yarn equivalents work from the root via `scripts/run-workspace.mjs`.

---

## CI

Workflow `.github/workflows/ci.yml`:

- **Backend:** lint → unit → E2E → build
- **Frontend:** lint → unit → build
- **Docker:** production image build on `main`

---

## Related docs

- [Root README](../README.md)
- [Backend README](../backend/README.md)
- [Frontend README](../frontend/README.md)
- [GitHub setup](./GITHUB.md)
