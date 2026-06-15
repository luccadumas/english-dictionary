# English Dictionary

> Full-stack English dictionary application

A complete platform for looking up English words with JWT authentication, search history, async favorites, Redis caching, and cursor pagination.

## Links

| Environment | URL |
|-------------|-----|
| Frontend (Vercel) | _configure after deploy_ |
| API (Railway) | _configure after deploy_ |
| Swagger | `{API_URL}/docs` |

## Stack

**Backend:** NestJS 10 · TypeScript · PostgreSQL · Prisma · Redis · BullMQ · JWT · Swagger · Jest

**Frontend:** Next.js 15 · App Router · TanStack Query · Shadcn UI · TailwindCSS · Zod · React Hook Form

**DevOps:** Docker · GitHub Actions · Railway · Vercel

## Prerequisites

- Node.js 22+ (backend) and Node.js 20+ (frontend)
- Docker and Docker Compose
- **npm** (v7+) **or Yarn** (v1 classic or Berry)

Root scripts work with **npm** and **Yarn** — the package manager is detected automatically.

## Quick start

### With npm

```bash
# 1. Start infrastructure
npm run dev:infra

# 2. Install dependencies (at root or in each package)
npm install --prefix backend
npm install --prefix frontend

# 3. Backend
cd backend
cp .env.example .env
npx prisma migrate dev
npm run import:words   # optional (~370k words)
cd ..
npm run dev:backend

# 4. Frontend (another terminal)
cd frontend
cp .env.example .env.local
cd ..
npm run dev:frontend
```

### With Yarn

```bash
# 1. Start infrastructure
yarn dev:infra

# 2. Install dependencies at root (workspaces)
yarn install

# 3. Backend
cd backend
cp .env.example .env
yarn prisma:migrate
yarn import:words   # optional (~370k words)
cd ..
yarn dev:backend

# 4. Frontend (another terminal)
cd frontend
cp .env.example .env.local
cd ..
yarn dev:frontend
```

### Local URLs

- Frontend: http://localhost:3000
- API: http://localhost:3333
- Swagger: http://localhost:3333/docs

## Root scripts (npm or Yarn)

| Script | Description |
|--------|-------------|
| `dev:infra` | Starts Postgres and Redis via Docker |
| `dev:backend` | API in watch mode |
| `dev:frontend` | Next.js dev server |
| `build` | Build backend + frontend |
| `test` | Backend unit tests |
| `test:e2e` | Backend E2E tests |
| `test:all` | Backend unit + E2E + frontend unit |
| `lint` | Lint backend + frontend |
| `import:words` | Import words into the database |

Examples:

```bash
npm run dev:backend
# or
yarn dev:backend
```

## Implemented highlights

| Feature | Evidence |
|---------|----------|
| OpenAPI 3.0 | `/docs` + `/docs-json` |
| Unit + E2E tests | `npm test` / `yarn test` + `test:e2e` |
| Docker prod | `docker compose --profile prod up` |
| Railway + Vercel deploy | See [Deploy](#deploy) below |
| Async favorites queue | BullMQ → 202 Accepted |
| Cursor pagination | `previous`/`next`/`hasPrev`/`hasNext`/`totalDocs` — see note below |
| Request ID + observability | headers `x-request-id`, `x-cache`, `x-response-time` |

> **Pagination:** the challenge README shows `page`/`totalPages`; we implemented **cursor pagination** (`previous`/`next`) as an allowed enhancement.

## Tests

### npm

```bash
npm run test:all

cd backend
npm test
npm run test:e2e

cd frontend
npm test
npm run build
```

### Yarn

```bash
yarn test:all

cd backend
yarn test
yarn test:e2e

cd frontend
yarn test
yarn build
```

Detailed conventions in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Deploy

1. Publish to GitHub: [docs/GITHUB.md](docs/GITHUB.md)

### Railway (API)

1. Connect repo → uses `/railway.toml` and root `Dockerfile`
2. Add **PostgreSQL** and **Redis**
3. Variables: `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `REDIS_URL=${{Redis.REDIS_URL}}`, `JWT_SECRET`, `NODE_ENV=production`, `PORT=3333`, `CORS_ORIGIN=<vercel-url>`
4. Generate public domain → note API URL
5. One-time: `railway run npm run import:words`

### Vercel (frontend)

1. Import repo `luccadumas/english-dictionary` → **Root Directory:** `frontend`
2. Set `NEXT_PUBLIC_API_URL` to the Railway API URL
3. Deploy → update Railway `CORS_ORIGIN` with the Vercel URL

Or from `frontend/`: `vercel link --yes` → `vercel --prod`

Or run `.\scripts\railway-setup.ps1` for API setup (Railway only).

Checklist:

- [ ] `npm run test:all` passes locally
- [ ] Repo pushed to GitHub; CI green
- [ ] API `/` and `/docs` respond in production
- [ ] Frontend login and word search work

## Documentation

- [API (backend)](backend/README.md)
- [Web (frontend)](frontend/README.md)
- [Architecture and structure](docs/ARCHITECTURE.md)
- [GitHub setup](docs/GITHUB.md)

## Structure

```
dictionary/
├── package.json             # Monorepo orchestration (npm / Yarn)
├── scripts/
│   └── run-workspace.mjs    # npm and Yarn compatible scripts
├── backend/
│   ├── src/                 # API code (modules/, infra/, shared/)
│   ├── test/
│   │   ├── e2e/             # Integration tests (*.e2e-spec.ts)
│   │   └── helpers/         # Shared E2E utilities
│   ├── scripts/             # import:words and other ops scripts
│   ├── prisma/
│   └── jest.config.ts
├── frontend/
│   ├── src/app/             # Routes (Server Components)
│   ├── src/types/           # Domain types (auth, dictionary, ...)
│   ├── src/components/      # Feature UI + Shadcn
│   └── src/lib/hooks/       # Domain hooks
├── docs/                    # ARCHITECTURE, GITHUB
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## License

MIT
