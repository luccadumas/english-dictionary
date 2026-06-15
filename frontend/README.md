# Dictionary Web

Frontend for **English Dictionary** — word search, paginated dictionary, favorites, history, and authentication, with i18n support (pt-BR, en, es).

## Stack

- Next.js 15 · App Router · React 19
- TanStack Query · Axios
- Shadcn UI · TailwindCSS
- next-intl · next-themes
- Zod · React Hook Form · Vitest

## Prerequisites

- Node.js **20+**
- API running at http://localhost:3333
- **npm** or **Yarn**

## Setup

```bash
cd frontend
cp .env.example .env.local
```

### Environment variables

| Variable | Description | Local default |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3333` |

## Run

```bash
# npm
npm install
npm run dev

# Yarn (monorepo root with workspaces)
yarn install
yarn dev:frontend
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

From monorepo root: `npm run dev:frontend` or `yarn dev:frontend`.

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

## Structure

```
frontend/src/
├── app/                  # App Router routes
│   └── [locale]/         # i18n layout
├── components/           # Feature UI (dictionary, auth, layout, ...)
├── lib/
│   ├── api/              # Axios client
│   ├── hooks/            # Domain hooks
│   └── query/            # Prefetch and pagination
├── messages/             # Translations (pt-BR, en, es)
└── types/                # TypeScript types
```

## Tests

```bash
npm test
npm run build

# or
yarn test
yarn build
```

From monorepo root: `npm run test:all` / `yarn test:all` (includes backend).

## Monorepo documentation

- [Root README](../README.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [GitHub setup](../docs/GITHUB.md)
