# English Dictionary

Full-stack application for looking up English words: JWT authentication, search history, async favorites (BullMQ), Redis caching, and cursor pagination.

## Technologies

| Layer | Stack |
|-------|-------|
| **Language** | TypeScript |
| **Backend** | NestJS 10 · Prisma · PostgreSQL · Redis · BullMQ · JWT · Swagger · Jest |
| **Frontend** | Next.js 15 (App Router) · TanStack Query · Shadcn UI · Tailwind CSS · Zod · React Hook Form · next-intl |
| **DevOps** | Docker · Docker Compose · GitHub Actions · Railway (API) · Vercel (frontend) |
| **Runtime** | Node.js 22+ |

## Prerequisites

- [Node.js](https://nodejs.org/) **22+**
- [Docker](https://www.docker.com/) and Docker Compose
- **npm** (v7+) or **Yarn**

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/luccadumas/english-dictionary.git
cd english-dictionary
```

### 2. Environment variables

`.env` files are **not versioned** (see [.gitignore](#gitignore)). Copy the examples:

```bash
cp .env.example .env                    # optional — root reference
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**Backend** (`backend/.env`) — local development with Docker infra:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dictionary"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3333
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

If ports `5432`/`6379` are already in use, use alternate Docker Compose ports (see [Docker](#docker)):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:15432/dictionary"
REDIS_PORT=16379
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### 3. Choose a run mode

#### Option A — Docker (full stack)

Starts Postgres, Redis, API, and frontend at once:

```bash
# Production simulation (recommended to test everything)
npm run docker:prod

# Development with hot-reload
npm run docker:dev

# Stop all services
npm run docker:down
```

If default ports are in use:

```bash
POSTGRES_PORT=15432 REDIS_PORT=16379 npm run docker:prod
```

#### Option B — Hybrid development (infra in Docker, apps on host)

```bash
# 1. Start Postgres and Redis only
npm run dev:infra

# 2. Install dependencies
npm install --prefix backend
npm install --prefix frontend

# 3. Run migrations and import words (optional, ~370k)
cd backend
npx prisma migrate dev
npm run import:words
cd ..

# 4. Start API and frontend (separate terminals)
npm run dev:backend
npm run dev:frontend
```

With Yarn:

```bash
yarn dev:infra
yarn install
cd backend && cp .env.example .env && yarn prisma:migrate && yarn import:words && cd ..
yarn dev:backend   # terminal 1
yarn dev:frontend  # terminal 2
```

## Usage

### Local URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3333 |
| Swagger | http://localhost:3333/docs |

### Basic flow

1. Open http://localhost:3000
2. Sign up or log in (JWT required to query words)
3. Go to **Dictionary** to list and filter words
4. Click a word to open the modal with definition, phonetics, and examples
5. Use **Favorites** and **History** to manage saved words and recent searches

### Import words into the local database

The word list comes from [dwyl/english-words](https://github.com/dwyl/english-words/blob/master/words_dictionary.json) (~370,000 entries). **Definitions** come from the [Free Dictionary API](https://dictionaryapi.dev/) — rare words may appear in the list without an available definition.

```bash
# Local database (adjust port if using Docker with POSTGRES_PORT=15432)
DATABASE_URL="postgresql://postgres:postgres@localhost:15432/dictionary" npm run import:words
```

Remote import (Railway/production):

```bash
./scripts/import-words.sh
# or: npm run import:words:remote
```

> After importing, if the list appears empty, clear the Redis cache:  
> `docker exec dictionary_redis redis-cli FLUSHDB`

## Docker

| Command | Description |
|---------|-------------|
| `npm run dev:infra` | Postgres + Redis only |
| `npm run docker:dev` | Full dev stack (hot-reload) |
| `npm run docker:prod` | Full stack with production images |
| `npm run docker:down` | Stop all Docker Compose services |

Production images:

- **API:** `backend/Dockerfile` (also used by Railway via root `Dockerfile`)
- **Frontend:** `frontend/Dockerfile` (local simulation only — production uses Vercel)

## Available scripts

| Script | Description |
|--------|-------------|
| `dev:infra` | Start Postgres and Redis via Docker |
| `docker:dev` | Full stack in dev mode (hot-reload) |
| `docker:prod` | Full stack with production images |
| `docker:down` | Stop all Docker services |
| `dev:backend` | NestJS API in watch mode |
| `dev:frontend` | Next.js dev server |
| `build` | Build backend + frontend |
| `test` / `test:e2e` / `test:all` | Unit and E2E tests |
| `lint` | Lint backend + frontend |
| `import:words` | Import words into the local database |
| `import:words:remote` | Import words into Railway |

## .gitignore

The project includes `.gitignore` at the root, in `backend/`, and in `frontend/`. Main **ignored** patterns (not committed):

| Pattern | Reason |
|---------|--------|
| `node_modules/` | Locally installed dependencies |
| `dist/`, `.next/`, `out/`, `build/` | Build artifacts |
| `.env`, `.env.local`, `.env.*.local`, `.env.production` | Secrets and local configuration |
| `.vercel`, `.railway` | Deploy credentials |
| `coverage/` | Test reports |
| `.DS_Store`, `.idea/`, `.vscode/` | OS and IDE files |

**Important:** always create your `.env` files from `.env.example` before running the project.

## Deploy (production)

| Environment | URL |
|-------------|-----|
| Frontend (Vercel) | https://english-dictionary-web.vercel.app |
| API (Railway) | https://dictionary-api-production-d35d.up.railway.app |
| Swagger | https://dictionary-api-production-d35d.up.railway.app/docs |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/GITHUB.md](docs/GITHUB.md), [backend/README.md](backend/README.md), and [frontend/README.md](frontend/README.md) for details.

## Project structure

```
english-dictionary/
├── .gitignore
├── docker-compose.yml
├── Dockerfile                 # API — Railway
├── railway.toml
├── package.json
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   └── prisma/
├── frontend/
│   ├── Dockerfile
│   ├── .env.example
│   └── vercel.json
├── scripts/
│   ├── import-words.sh        # Remote import (Railway)
│   └── run-workspace.mjs
└── docs/
```

## Tests

```bash
npm run test:all
```

## License

MIT
