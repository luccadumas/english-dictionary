# English Dictionary

> Full-stack English dictionary application

A complete platform for looking up English words with JWT authentication, search history, async favorites, Redis caching, and cursor pagination.

## Links

| Environment | URL |
|-------------|-----|
| Frontend (Vercel) | https://english-dictionary-web.vercel.app |
| API (Railway) | https://dictionary-api-production-d35d.up.railway.app |
| Swagger | https://dictionary-api-production-d35d.up.railway.app/docs |

## Stack

**Backend:** NestJS 10 · TypeScript · PostgreSQL · Prisma · Redis · BullMQ · JWT · Swagger · Jest

**Frontend:** Next.js 15 · App Router · TanStack Query · Shadcn UI · TailwindCSS · Zod · React Hook Form

**DevOps:** Docker Compose (local) · GitHub Actions · Railway (API) · Vercel (frontend)

## Prerequisites

- Node.js **22+**
- Docker and Docker Compose (local infra and optional full-stack simulation)
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
npm run dev   # or from root: npm run dev:frontend
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

From `frontend/` only: `yarn dev` (after `yarn install` at root or in `frontend/`).

### Local URLs

- Frontend: http://localhost:3000
- API: http://localhost:3333
- Swagger: http://localhost:3333/docs

## Docker (local)

Docker is used for **local development and testing**, not for production frontend deploy.

| Command | What it starts |
|---------|----------------|
| `npm run dev:infra` | Postgres + Redis only |
| `docker compose --profile dev up` | Infra + API (watch) + frontend (dev) |
| `docker compose --profile prod up --build` | Full stack with production images |
| `npm run docker:dev` | Same as `docker compose --profile dev up --build` |
| `npm run docker:prod` | Same as `docker compose --profile prod up --build` |

Production images:

- **API:** `backend/Dockerfile` (also used by Railway via root `Dockerfile`)
- **Frontend:** `frontend/Dockerfile` (local simulation only — production uses Vercel)

```bash
# Infra only (recommended for day-to-day dev)
npm run dev:infra

# Full local prod simulation
docker compose --profile prod up --build
# or: npm run docker:prod

# If ports 5432/6379 are busy on your machine:
POSTGRES_PORT=15432 REDIS_PORT=16379 docker compose --profile prod up --build
```

## Root scripts (npm or Yarn)

| Script | Description |
|--------|-------------|
| `dev:infra` | Starts Postgres and Redis via Docker |
| `docker:dev` | Full dev stack in Docker (hot-reload) |
| `docker:prod` | Full prod simulation in Docker |
| `docker:down` | Stops all Docker Compose services |
| `dev:backend` | API in watch mode |
| `dev:frontend` | Next.js dev server |
| `build` | Build backend + frontend |
| `test` | Backend unit tests |
| `test:e2e` | Backend E2E tests |
| `test:all` | Backend unit + E2E + frontend unit |
| `lint` | Lint backend + frontend |
| `import:words` | Import words into the local database |
| `import:words:remote` | Import words into Railway production DB |

```bash
# Same scripts with npm or Yarn at the root
npm run dev:frontend
yarn dev:frontend

# Or inside frontend/
cd frontend && yarn dev
cd frontend && npm run dev
```

## Implemented highlights

| Feature | Evidence |
|---------|----------|
| OpenAPI 3.0 | `/docs` + `/docs-json` |
| Unit + E2E tests | `npm test` / `yarn test` + `test:e2e` |
| Docker local stack | `docker compose --profile prod up` |
| Railway + Vercel deploy | See [Deploy](#deploy) |
| Async favorites queue | BullMQ → 202 Accepted |
| Cursor pagination | `previous`/`next`/`hasPrev`/`hasNext`/`totalDocs` |
| Request ID + observability | headers `x-request-id`, `x-cache`, `x-response-time` |

## Tests

```bash
npm run test:all
```

Detailed conventions in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Deploy

Production architecture:

```
GitHub (main)
    ├── Railway  → dictionary-api  (root Dockerfile + railway.toml)
    │              Postgres + Redis plugins
    └── Vercel   → frontend/       (Next.js, Node 22)
```

### 1. GitHub

Publish the repo: [docs/GITHUB.md](docs/GITHUB.md)

Repository: https://github.com/luccadumas/english-dictionary

### 2. Railway (API)

1. Create project → connect repo `luccadumas/english-dictionary`
2. Service `dictionary-api` uses root `Dockerfile` and `railway.toml`
3. Add **PostgreSQL** and **Redis** plugins
4. Set variables:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
   | `REDIS_URL` | `${{Redis.REDIS_URL}}` |
   | `JWT_SECRET` | strong random secret |
   | `JWT_EXPIRES_IN` | `7d` |
   | `PORT` | `3333` |
   | `NODE_ENV` | `production` |
   | `CORS_ORIGIN` | `https://english-dictionary-web.vercel.app` |

5. Generate public domain
6. Import words (one-time): `./scripts/import-words.sh` or `npm run import:words:remote`

Helper script (API only): `.\scripts\railway-setup.ps1` after `railway login`

### 3. Vercel (frontend)

1. Import repo → **Root Directory:** `frontend`
2. Set `NEXT_PUBLIC_API_URL` = Railway API URL
3. Deploy

CLI (from `frontend/`):

```bash
vercel link --yes -p english-dictionary-web
vercel env add NEXT_PUBLIC_API_URL production   # paste API URL
vercel --prod
```

Config: `frontend/vercel.json` (Node 22, region `gru1`)

### Checklist

- [x] API online at Railway
- [x] Frontend online at Vercel
- [x] `CORS_ORIGIN` points to Vercel URL
- [ ] `npm run test:all` passes locally
- [ ] CI green on GitHub
- [ ] Login and word search work in production

## Documentation

- [API (backend)](backend/README.md)
- [Web (frontend)](frontend/README.md)
- [Architecture and structure](docs/ARCHITECTURE.md)
- [GitHub setup](docs/GITHUB.md)

## Structure

```
dictionary/
├── package.json             # Monorepo orchestration (npm / Yarn)
├── Dockerfile               # API image for Railway (monorepo root context)
├── railway.toml             # Railway config for dictionary-api
├── docker-compose.yml       # Local dev + prod simulation
├── scripts/
│   ├── run-workspace.mjs
│   └── railway-setup.ps1    # Railway API setup helper
├── backend/
│   ├── Dockerfile           # API image for docker-compose
│   └── ...
├── frontend/
│   ├── Dockerfile           # Local Docker only (prod → Vercel)
│   ├── vercel.json          # Vercel config
│   └── ...
├── docs/
└── .github/workflows/ci.yml
```

## License

MIT
