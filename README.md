# English Dictionary

Aplicação full-stack para consulta de palavras em inglês: autenticação JWT, histórico de buscas, favoritos assíncronos (BullMQ), cache Redis e paginação por cursor.

## Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Linguagem** | TypeScript |
| **Backend** | NestJS 10 · Prisma · PostgreSQL · Redis · BullMQ · JWT · Swagger · Jest |
| **Frontend** | Next.js 15 (App Router) · TanStack Query · Shadcn UI · Tailwind CSS · Zod · React Hook Form · next-intl |
| **DevOps** | Docker · Docker Compose · GitHub Actions · Railway (API) · Vercel (frontend) |
| **Runtime** | Node.js 22+ |

## Pré-requisitos

- [Node.js](https://nodejs.org/) **22+**
- [Docker](https://www.docker.com/) e Docker Compose
- **npm** (v7+) ou **Yarn**

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/luccadumas/english-dictionary.git
cd english-dictionary
```

### 2. Variáveis de ambiente

Os arquivos `.env` **não são versionados** (veja [.gitignore](#gitignore)). Copie os exemplos:

```bash
cp .env.example .env                    # opcional - referência na raiz
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**Backend** (`backend/.env`) - desenvolvimento local com infra Docker:

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

Se as portas `5432`/`6379` estiverem ocupadas no Docker Compose, use as portas alternativas (veja [Docker](#docker)):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:15432/dictionary"
REDIS_PORT=16379
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### 3. Escolha um modo de execução

#### Opção A - Docker (stack completa)

Sobe Postgres, Redis, API e frontend de uma vez:

```bash
# Simulação de produção (recomendado para testar tudo)
npm run docker:prod

# Desenvolvimento com hot-reload
npm run docker:dev

# Parar todos os serviços
npm run docker:down
```

Se as portas padrão estiverem em uso:

```bash
POSTGRES_PORT=15432 REDIS_PORT=16379 npm run docker:prod
```

#### Opção B - Desenvolvimento híbrido (infra no Docker, apps no host)

```bash
# 1. Sobe apenas Postgres e Redis
npm run dev:infra

# 2. Instala dependências
npm install --prefix backend
npm install --prefix frontend

# 3. Migra o banco e importa palavras (opcional, ~370k)
cd backend
npx prisma migrate dev
npm run import:words
cd ..

# 4. Inicia API e frontend (terminais separados)
npm run dev:backend
npm run dev:frontend
```

Com Yarn:

```bash
yarn dev:infra
yarn install
cd backend && cp .env.example .env && yarn prisma:migrate && yarn import:words && cd ..
yarn dev:backend   # terminal 1
yarn dev:frontend  # terminal 2
```

## Como usar

### URLs locais

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3333 |
| Swagger | http://localhost:3333/docs |

### Fluxo básico

1. Acesse http://localhost:3000
2. Crie uma conta ou faça login (JWT obrigatório para consultar palavras)
3. Vá em **Dictionary** para listar e filtrar palavras
4. Clique em uma palavra para abrir o modal com definição, fonética e exemplos
5. Use **Favorites** e **History** para gerenciar palavras salvas e buscas recentes

### Importar palavras no banco local

A lista de palavras vem do repositório [dwyl/english-words](https://github.com/dwyl/english-words/blob/master/words_dictionary.json) (~370.000 entradas). As **definições** vêm da [Free Dictionary API](https://dictionaryapi.dev/) - palavras raras podem aparecer na lista sem definição disponível.

```bash
# Banco local (ajuste a porta se usar Docker com POSTGRES_PORT=15432)
DATABASE_URL="postgresql://postgres:postgres@localhost:15432/dictionary" npm run import:words
```

Import remoto (Railway/produção):

```bash
./scripts/import-words.sh
# ou: npm run import:words:remote
```

> Após importar, se a lista aparecer vazia, limpe o cache Redis:  
> `docker exec dictionary_redis redis-cli FLUSHDB`

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `dev:infra` | Sobe Postgres e Redis via Docker |
| `docker:dev` | Stack completa em modo dev (hot-reload) |
| `docker:prod` | Stack completa com imagens de produção |
| `docker:down` | Para todos os serviços Docker |
| `dev:backend` | API NestJS em watch mode |
| `dev:frontend` | Next.js dev server |
| `build` | Build backend + frontend |
| `test` / `test:e2e` / `test:all` | Testes unitários e E2E |
| `lint` | Lint backend + frontend |
| `import:words` | Importa palavras no banco local |
| `import:words:remote` | Importa palavras no Railway |

## .gitignore

O projeto possui `.gitignore` na raiz, em `backend/` e em `frontend/`. Os principais arquivos **ignorados** (não commitados):

| Padrão | Motivo |
|--------|--------|
| `node_modules/` | Dependências instaladas localmente |
| `dist/`, `.next/`, `out/`, `build/` | Artefatos de build |
| `.env`, `.env.local`, `.env.*.local`, `.env.production` | Segredos e configuração local |
| `.vercel`, `.railway` | Credenciais de deploy |
| `coverage/` | Relatórios de testes |
| `.DS_Store`, `.idea/`, `.vscode/` | Arquivos de SO e IDE |

**Importante:** sempre crie seus `.env` a partir dos arquivos `.env.example` antes de rodar o projeto.

## Deploy (produção)

| Ambiente | URL |
|----------|-----|
| Frontend (Vercel) | https://english-dictionary-web.vercel.app |
| API (Railway) | https://dictionary-api-production-d35d.up.railway.app |
| Swagger | https://dictionary-api-production-d35d.up.railway.app/docs |

Detalhes em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/GITHUB.md](docs/GITHUB.md), [backend/README.md](backend/README.md) e [frontend/README.md](frontend/README.md).

## Estrutura do projeto

```
english-dictionary/
├── .gitignore
├── docker-compose.yml
├── Dockerfile                 # API - Railway
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
│   ├── import-words.sh        # Import remoto (Railway)
│   └── run-workspace.mjs
└── docs/
```

## Testes

```bash
npm run test:all
```

## Licença

MIT
