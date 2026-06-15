# Dictionary Web

Frontend for **English Dictionary** — word search, paginated dictionary, favorites, history, and authentication, with i18n support (pt-BR, en, es).

**Production:** https://english-dictionary-web.vercel.app

## Stack

- Next.js 15 · App Router · React 19 · Node.js 22
- TanStack Query · Axios
- Shadcn UI · TailwindCSS
- next-intl · next-themes
- Zod · React Hook Form · Vitest

## Prerequisites

- Node.js **22+**
- API running at http://localhost:3333 (local) or Railway URL (production)
- **npm** or **Yarn**

## Setup

### npm

```bash
cd frontend
cp .env.example .env.local
npm install --legacy-peer-deps
```

### Yarn

From the monorepo root (recommended — workspaces):

```bash
yarn install
cp frontend/.env.example frontend/.env.local
```

Or only the frontend package:

```bash
cd frontend
cp .env.example .env.local
yarn install
```

> Peer dependencies: `frontend/.npmrc` sets `legacy-peer-deps=true` (npm and Yarn Classic). Yarn Berry uses `.yarnrc.yml` at the repo root with `nodeLinker: node-modules`.

### Environment variables

| Variable | Description | Local default |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3333` |

## Run

```bash
# npm (inside frontend/)
npm run dev
npm run build
npm test

# Yarn (inside frontend/)
yarn dev
yarn build
yarn test

# Yarn or npm from monorepo root
yarn dev:frontend    # or: npm run dev:frontend
yarn build           # builds backend + frontend
```

Local app: http://localhost:3000

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Next.js dev server (port 3000) |
| `build` | Production build |
| `start` | Production server |
| `lint` | ESLint (Next.js) |
| `test` | Unit tests (Vitest) |
| `test:watch` | Vitest watch mode |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — quick search and recent history |
| `/dictionary` | Full dictionary with filter and infinite scroll |
| `/words/[word]` | Word detail page |
| `/favorites` | Saved favorites |
| `/history` | Search history |
| `/login` · `/register` | Authentication |

## Features

- **Debounced search** (1s) with loading state in the search field
- **Cursor pagination** with infinite scroll
- **Async favorites** — immediate UI feedback
- **Optimistic navigation** — skeleton while switching menu pages
- **Data prefetch** on nav link hover/click
- **Light/dark theme** (cookie `app-theme`)
- **i18n** — locales `en`, `pt-BR`, `es` (cookie `app_locale`)

## Deploy (Vercel)

Production frontend runs on **Vercel**, not Docker.

### Dashboard

1. Import https://github.com/luccadumas/english-dictionary
2. **Root Directory:** `frontend`
3. Environment variable: `NEXT_PUBLIC_API_URL` = Railway API URL
4. Deploy

### CLI

```bash
cd frontend
vercel link --yes -p english-dictionary-web
echo "https://your-api.up.railway.app" | vercel env add NEXT_PUBLIC_API_URL production
vercel --prod
```

Settings in `vercel.json`:

- Node 22 (via `engines` in `package.json`)
- Region: `gru1` (São Paulo)
- Install: `npm install --legacy-peer-deps` (Vercel; local dev also supports Yarn — see [Setup](#setup))

After deploy, set Railway `CORS_ORIGIN` to your Vercel URL.

## Docker (local only)

`frontend/Dockerfile` is for **local full-stack simulation** via docker-compose, not production deploy.

```bash
# From monorepo root
docker compose --profile prod up --build web-prod api-prod postgres redis
```

Build manually:

```bash
docker build -t dictionary-web ./frontend --target runner \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Structure

```
frontend/
├── Dockerfile           # Local Docker (standalone output)
├── vercel.json          # Vercel production config
├── next.config.mjs
└── src/
    ├── app/[locale]/    # App Router + i18n
    ├── components/
    ├── lib/
    ├── messages/
    └── types/
```

## Tests

```bash
# npm
npm test
npm run build

# Yarn
yarn test
yarn build
```

From monorepo root: `npm run test:all` or `yarn test:all`

## Monorepo documentation

- [Root README](../README.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [GitHub setup](../docs/GITHUB.md)
